/**
 * ITACHI-XMD — Session Web Server
 * Intégré directement dans le bot
 * by CENTRAL-HEX 💎
 */
const { makeid } = require('./session_utils');
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const pino = require('pino');
const QRCode = require('qrcode');
const {
    default: makeWASocket,
    useMultiFileAuthState,
    delay,
    makeCacheableSignalKeyStore,
    Browsers
} = require('@whiskeysockets/baileys');

function removeFile(filePath) {
    if (!fs.existsSync(filePath)) return false;
    fs.rmSync(filePath, { recursive: true, force: true });
}

// ─── PAIR CODE ───────────────────────────────────────────────
router.get('/pair', async (req, res) => {
    const id = makeid();
    let num = req.query.number;
    if (!num) return res.json({ error: 'Numéro requis' });

    const tempDir = path.join(process.cwd(), 'temp_session', id);

    async function PAIR() {
        const { state, saveCreds } = await useMultiFileAuthState(tempDir);
        try {
            let sock = makeWASocket({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(
                        state.keys,
                        pino({ level: 'fatal' }).child({ level: 'fatal' })
                    ),
                },
                printQRInTerminal: false,
                logger: pino({ level: 'fatal' }).child({ level: 'fatal' }),
                browser: Browsers.macOS('Safari'),
            });

            if (!sock.authState.creds.registered) {
                await delay(1500);
                num = num.replace(/[^0-9]/g, '');
                const code = await sock.requestPairingCode(num);
                const formatted = code?.match(/.{1,4}/g)?.join('-') || code;
                if (!res.headersSent) res.json({ code: formatted });
            }

            sock.ev.on('creds.update', saveCreds);

            sock.ev.on('connection.update', async (s) => {
                const { connection, lastDisconnect } = s;

                if (connection === 'open') {
                    await delay(3000);

                    // Copier session dans ./session du bot
                    const sessionDir = path.join(process.cwd(), 'session');
                    if (!fs.existsSync(sessionDir)) {
                        fs.mkdirSync(sessionDir, { recursive: true });
                    }
                    const files = fs.readdirSync(tempDir);
                    for (const file of files) {
                        fs.copyFileSync(
                            path.join(tempDir, file),
                            path.join(sessionDir, file)
                        );
                    }

                    global.botConnected = true;
                    console.log('✅ Session connectée ! Bot prêt.');

                    if (global.botRestart) global.botRestart();

                    await delay(500);
                    await sock.ws.close();
                    removeFile(tempDir);
                    return;
                }

                if (
                    connection === 'close' &&
                    lastDisconnect?.error?.output?.statusCode !== 401
                ) {
                    await delay(5000);
                    PAIR();
                }
            });

        } catch (err) {
            console.log('Pair error:', err.message);
            removeFile(tempDir);
            if (!res.headersSent) res.json({ code: 'Service indisponible' });
        }
    }

    return await PAIR();
});

// ─── QR CODE ─────────────────────────────────────────────────
router.get('/qr', async (req, res) => {
    const id = makeid();
    const tempDir = path.join(process.cwd(), 'temp_session', id);

    async function QR() {
        const { state, saveCreds } = await useMultiFileAuthState(tempDir);
        try {
            let sock = makeWASocket({
                auth: state,
                printQRInTerminal: false,
                logger: pino({ level: 'silent' }),
                browser: Browsers.macOS('Safari'),
            });

            sock.ev.on('creds.update', saveCreds);

            sock.ev.on('connection.update', async (s) => {
                const { connection, lastDisconnect, qr } = s;

                if (qr) {
                    const buf = await QRCode.toBuffer(qr);
                    if (!res.headersSent) res.end(buf);
                }

                if (connection === 'open') {
                    await delay(3000);

                    const sessionDir = path.join(process.cwd(), 'session');
                    if (!fs.existsSync(sessionDir)) {
                        fs.mkdirSync(sessionDir, { recursive: true });
                    }
                    const files = fs.readdirSync(tempDir);
                    for (const file of files) {
                        fs.copyFileSync(
                            path.join(tempDir, file),
                            path.join(sessionDir, file)
                        );
                    }

                    global.botConnected = true;
                    console.log('✅ Session connectée via QR !');

                    if (global.botRestart) global.botRestart();

                    await delay(500);
                    await sock.ws.close();
                    removeFile(tempDir);
                    return;
                }

                if (
                    connection === 'close' &&
                    lastDisconnect?.error?.output?.statusCode !== 401
                ) {
                    await delay(5000);
                    QR();
                }
            });

        } catch (err) {
            console.log('QR error:', err.message);
            if (!res.headersSent) res.json({ error: 'Service indisponible' });
            removeFile(tempDir);
        }
    }

    return await QR();
});

// ─── STATUS ──────────────────────────────────────────────────
router.get('/status', (req, res) => {
    const sessionDir = path.join(process.cwd(), 'session');
    const hasSession = fs.existsSync(path.join(sessionDir, 'creds.json'));
    res.json({
        connected: global.botConnected || false,
        hasSession,
    });
});

module.exports = router;
