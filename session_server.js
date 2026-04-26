/**
 * ITACHI-XMD — Session Web Server
 * Intégré directement dans le bot
 * by CENTRAL-HEX 💎
 */

const express = require('express');
const QRCode = require('qrcode');
const pino = require('pino');
const fs = require('fs');
const path = require('path');
const { makeid } = require('./session_utils');

const {
    default: makeWASocket,
    useMultiFileAuthState,
    makeCacheableSignalKeyStore,
    Browsers,
    delay
} = require('@whiskeysockets/baileys');

const router = express.Router();

function removeFile(filePath) {
    if (!fs.existsSync(filePath)) return false;
    fs.rmSync(filePath, { recursive: true, force: true });
}

// ─── PAIR CODE ──────────────────────────────────────────────
router.get('/pair', async (req, res) => {
    const id = makeid();
    let num = req.query.number;

    if (!num) return res.json({ error: 'Numéro requis' });

    const tempDir = path.join(process.cwd(), 'temp_session', id);

    async function connectAndPair() {
        const { state, saveCreds } = await useMultiFileAuthState(tempDir);
        try {
            let sock = makeWASocket({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'fatal' })),
                },
                printQRInTerminal: false,
                logger: pino({ level: 'fatal' }),
                browser: Browsers.ubuntu('Chrome'),
                syncFullHistory: false,
            });

            if (!sock.authState.creds.registered) {
                await delay(2000);
                num = num.replace(/[^0-9]/g, '');
                let code = await sock.requestPairingCode(num);
                code = code?.match(/.{1,4}/g)?.join('-') || code;
                if (!res.headersSent) res.json({ code });
            }

            sock.ev.on('creds.update', saveCreds);

            sock.ev.on('connection.update', async (s) => {
                const { connection, lastDisconnect } = s;

                if (connection === 'open') {
                    await delay(3000);

                    const sessionDir = path.join(process.cwd(), 'session');
                    if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir, { recursive: true });

                    const files = fs.readdirSync(tempDir);
                    for (const file of files) {
                        fs.copyFileSync(
                            path.join(tempDir, file),
                            path.join(sessionDir, file)
                        );
                    }

                    console.log('✅ Session copiée dans ./session — Bot prêt !');

                    if (global.botRestart) global.botRestart();

                    await delay(500);
                    await sock.ws.close();
                    removeFile(tempDir);
                    return;
                }

                if (connection === 'close' && lastDisconnect?.error?.output?.statusCode !== 401) {
                    await delay(5000);
                    connectAndPair();
                }
            });

        } catch (err) {
            console.log('Pair error:', err.message);
            removeFile(tempDir);
            if (!res.headersSent) res.json({ code: 'Service indisponible' });
        }
    }

    return await connectAndPair();
});

// ─── QR CODE ────────────────────────────────────────────────
router.get('/qr', async (req, res) => {
    const id = makeid();
    const tempDir = path.join(process.cwd(), 'temp_session', id);

    async function connectAndQR() {
        const { state, saveCreds } = await useMultiFileAuthState(tempDir);
        try {
            let sock = makeWASocket({
                auth: state,
                printQRInTerminal: false,
                logger: pino({ level: 'silent' }),
                browser: Browsers.ubuntu('Desktop'),
            });

            sock.ev.on('creds.update', saveCreds);

            sock.ev.on('connection.update', async (s) => {
                const { connection, lastDisconnect, qr } = s;

                if (qr) {
                    const qrBuffer = await QRCode.toBuffer(qr);
                    if (!res.headersSent) res.end(qrBuffer);
                }

                if (connection === 'open') {
                    await delay(3000);

                    const sessionDir = path.join(process.cwd(), 'session');
                    if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir, { recursive: true });

                    const files = fs.readdirSync(tempDir);
                    for (const file of files) {
                        fs.copyFileSync(
                            path.join(tempDir, file),
                            path.join(sessionDir, file)
                        );
                    }

                    console.log('✅ Session copiée via QR — Bot prêt !');

                    if (global.botRestart) global.botRestart();

                    await delay(500);
                    await sock.ws.close();
                    removeFile(tempDir);
                    return;
                }

                if (connection === 'close' && lastDisconnect?.error?.output?.statusCode !== 401) {
                    await delay(5000);
                    connectAndQR();
                }
            });

        } catch (err) {
            console.log('QR error:', err.message);
            if (!res.headersSent) res.json({ error: 'Service indisponible' });
            removeFile(tempDir);
        }
    }

    return await connectAndQR();
});

// ─── STATUS ─────────────────────────────────────────────────
router.get('/status', (req, res) => {
    const sessionDir = path.join(process.cwd(), 'session');
    const hasSession = fs.existsSync(path.join(sessionDir, 'creds.json'));
    res.json({
        connected: global.botConnected || false,
        hasSession,
        botName: 'ITACHI-XMD V2.0'
    });
});

module.exports = router;
