/**
 * ITACHI-XMD — Session Server
 * Basé sur ShadowCrew (qui fonctionne ✅)
 * by CENTRAL-HEX 💎
 */

const { makeid } = require('./session_utils');
const QRCode = require('qrcode');
const express = require('express');
const fs = require('fs');
const path = require('path');
let router = express.Router();
const pino = require('pino');
const {
    default: makeWASocket,
    useMultiFileAuthState,
    delay,
    makeCacheableSignalKeyStore,
    Browsers
} = require('@whiskeysockets/baileys');

function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, { recursive: true, force: true });
}

// ─── PAIR CODE ───────────────────────────────────────────────
router.get('/pair', async (req, res) => {
    const id = makeid();
    let num = req.query.number;
    if (!num) return res.json({ error: 'Numéro requis' });

    const tempDir = './temp_session/' + id;

    async function ITACHI_PAIR() {
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
                browser: Browsers.macOS('Chrome')
            });

            if (!sock.authState.creds.registered) {
                await delay(1500);
                num = num.replace(/[^0-9]/g, '');
                const code = await sock.requestPairingCode(num);
                if (!res.headersSent) {
                    await res.send({ code });
                }
            }

            sock.ev.on('creds.update', saveCreds);

            sock.ev.on('connection.update', async (s) => {
                const { connection, lastDisconnect } = s;

                if (connection === 'open') {
                    await delay(5000);

                    // ✅ Copier session dans ./session du bot
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
                    console.log('✅ Bot connecté ! Session copiée.');

                    let MSG = `
╭━━━━━━━━━━━━━━━━━━━━━━╮
┃   🥷 ITACHI-XMD V2.0 🥷   ┃
┃   ✦ by CENTRAL-HEX ✦    ┃
╰━━━━━━━━━━━━━━━━━━━━━━╯

✅ *BOT CONNECTÉ AVEC SUCCÈS !*

Ton bot ITACHI-XMD est maintenant en ligne.
Tape *.menu* pour voir toutes les commandes.

━━━━━━━━━━━━━━━━━━━━━━━

💎 CENTRAL-HEX — Où la technologie rencontre la créativité. 🚀
https://whatsapp.com/channel/0029VbC8YkY7oQhiOiiSpy1z`;

                    await sock.sendMessage(sock.user.id, { text: MSG });
                    await delay(100);
                    await sock.ws.close();
                    return await removeFile(tempDir);

                } else if (
                    connection === 'close' &&
                    lastDisconnect &&
                    lastDisconnect.error &&
                    lastDisconnect.error.output.statusCode != 401
                ) {
                    await delay(10000);
                    ITACHI_PAIR();
                }
            });

        } catch (err) {
            console.log('Pair error:', err.message);
            await removeFile(tempDir);
            if (!res.headersSent) {
                await res.send({ code: 'Service Currently Unavailable' });
            }
        }
    }

    return await ITACHI_PAIR();
});

// ─── QR CODE ─────────────────────────────────────────────────
router.get('/qr', async (req, res) => {
    const id = makeid();
    const tempDir = './temp_session/' + id;

    async function ITACHI_QR() {
        const { state, saveCreds } = await useMultiFileAuthState(tempDir);
        try {
            let sock = makeWASocket({
                auth: state,
                printQRInTerminal: false,
                logger: pino({ level: 'silent' }),
                browser: Browsers.macOS('Desktop'),
            });

            sock.ev.on('creds.update', saveCreds);

            sock.ev.on('connection.update', async (s) => {
                const { connection, lastDisconnect, qr } = s;

                if (qr) await res.end(await QRCode.toBuffer(qr));

                if (connection === 'open') {
                    await delay(5000);

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
                    console.log('✅ Bot connecté via QR !');

                    let MSG = `
╭━━━━━━━━━━━━━━━━━━━━━━╮
┃   🥷 ITACHI-XMD V2.0 🥷   ┃
┃   ✦ by CENTRAL-HEX ✦    ┃
╰━━━━━━━━━━━━━━━━━━━━━━╯

✅ *BOT CONNECTÉ AVEC SUCCÈS !*

Ton bot ITACHI-XMD est maintenant en ligne.
Tape *.menu* pour voir toutes les commandes.

💎 CENTRAL-HEX — Où la technologie rencontre la créativité. 🚀`;

                    await sock.sendMessage(sock.user.id, { text: MSG });
                    await delay(100);
                    await sock.ws.close();
                    return await removeFile(tempDir);

                } else if (
                    connection === 'close' &&
                    lastDisconnect &&
                    lastDisconnect.error &&
                    lastDisconnect.error.output.statusCode != 401
                ) {
                    await delay(10000);
                    ITACHI_QR();
                }
            });

        } catch (err) {
            console.log('QR error:', err.message);
            if (!res.headersSent) {
                await res.json({ code: 'Service is Currently Unavailable' });
            }
            await removeFile(tempDir);
        }
    }

    return await ITACHI_QR();
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
