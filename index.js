/**
 * ITACHI-XMD - Bot WhatsApp Multifonctions
 * Développé par IBSACKO™ & CENTRAL-HEX
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the MIT License.
 * Baileys Library by @adiwajshing
 */
require('dotenv').config();
require('./settings');

// ─── SESSION WEB SERVER ─────────────────────────────────────
const express = require('express');
const path = require('path');
const webApp = express();
const SESSION_PORT = process.env.PORT || 8000;

const sessionRouter = require('./session_server');
webApp.use('/session', sessionRouter);

// Page d'accueil
webApp.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'session_page.html'));
});

webApp.listen(SESSION_PORT, () => {
    console.log(`🌐 Site de session: http://localhost:${SESSION_PORT}`);
});

// Flag global pour savoir si le bot est connecté
global.botConnected = false;
global.botRestart = null;
// ────────────────────────────────────────────────────────────

const { Boom } = require('@hapi/boom')
const fs = require('fs')
const chalk = require('chalk')
const FileType = require('file-type')                          // ✅ FIX: parenthèse manquante ajoutée
const axios = require('axios')
const { handleMessages, handleGroupParticipantUpdate, handleStatus } = require('./main');
const PhoneNumber = require('awesome-phonenumber')
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./lib/exif')
const { smsg, isUrl, generateMessageTag, getBuffer, getSizeMedia, fetch, sleep, reSize } = require('./lib/myfunc')
const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    generateForwardMessageContent,
    prepareWAMessageMedia,
    generateWAMessageFromContent,
    generateMessageID,
    downloadContentFromMessage,
    jidDecode,
    proto,
    jidNormalizedUser,
    makeCacheableSignalKeyStore,
    Browsers,
    delay
} = require("@whiskeysockets/baileys")
const NodeCache = require("node-cache")
const pino = require("pino")
const readline = require("readline")
const { parsePhoneNumber } = require("libphonenumber-js")
const { PHONENUMBER_MCC } = require('@whiskeysockets/baileys/lib/Utils/generics')
const { rmSync, existsSync } = require('fs')
const { join } = require('path')

// Import lightweight store
const store = require('./lib/lightweight_store')

// Initialize store
store.readFromFile()
const settings = require('./settings')
setInterval(() => store.writeToFile(), settings.storeWriteInterval || 10000)

// Memory optimization - Force garbage collection if available
setInterval(() => {
    if (global.gc) {
        global.gc()
        console.log('🧹 Garbage collection completed')
    }
}, 60_000)

// Memory monitoring - Restart if RAM gets too high
setInterval(() => {
    const used = process.memoryUsage().rss / 1024 / 1024
    if (used > 400) {
        console.log('⚠️ RAM too high (>400MB), restarting bot...')
        process.exit(1)
    }
}, 30_000)

let phoneNumber = "224621963059"
let owner = JSON.parse(fs.readFileSync('./data/owner.json'))

global.botname = "ITACHI-XMD"
global.themeemoji = "•"
const pairingCode = !!phoneNumber || process.argv.includes("--pairing-code")
const useMobile = process.argv.includes("--mobile")

const rl = process.stdin.isTTY ? readline.createInterface({ input: process.stdin, output: process.stdout }) : null
const question = (text) => {
    if (rl) {
        return new Promise((resolve) => rl.question(text, resolve))
    } else {
        return Promise.resolve(settings.ownerNumber || phoneNumber)
    }
}


async function startXeonBotInc() {
    try {
        let { version, isLatest } = await fetchLatestBaileysVersion()
        const { state, saveCreds } = await useMultiFileAuthState(`./session`)
        const msgRetryCounterCache = new NodeCache()

        const XeonBotInc = makeWASocket({
            version,
            logger: pino({ level: 'silent' }),
            printQRInTerminal: !pairingCode,
            browser: Browsers.ubuntu('Chrome'),
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
            },
            markOnlineOnConnect: true,
            generateHighQualityLinkPreview: true,
            syncFullHistory: false,
            getMessage: async (key) => {
                let jid = jidNormalizedUser(key.remoteJid)
                let msg = await store.loadMessage(jid, key.id)
                return msg?.message || ""
            },
            msgRetryCounterCache,
            defaultQueryTimeoutMs: 60000,
            connectTimeoutMs: 60000,
            keepAliveIntervalMs: 10000,
        })

        XeonBotInc.ev.on('creds.update', saveCreds)

    store.bind(XeonBotInc.ev)

    XeonBotInc.ev.on('messages.upsert', async chatUpdate => {
        try {
            const mek = chatUpdate.messages[0]
            if (!mek.message) return
            mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
            if (mek.key && mek.key.remoteJid === 'status@broadcast') {
                await handleStatus(XeonBotInc, chatUpdate);
                return;
            }

            if (mek.key?.remoteJid?.endsWith('@g.us') && !mek.key.fromMe) {
                try {
                    const { handleAntimentionStatus } = require('./commands/antimentionstatus');
                    const sender = mek.key.participant || mek.key.remoteJid;
                    const chatId = mek.key.remoteJid;
                    await handleAntimentionStatus(XeonBotInc, chatId, sender, mek);
                } catch(e) { /* non critique */ }
            }

            if (!XeonBotInc.public && !mek.key.fromMe && chatUpdate.type === 'notify') {
                const isGroup = mek.key?.remoteJid?.endsWith('@g.us')
                if (!isGroup) return
            }
            if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return

            const isChannel = mek.key?.remoteJid?.endsWith('@newsletter');
            if (isChannel) {
                mek.key.fromMe = true;
            }

            if (XeonBotInc?.msgRetryCounterCache) {
                XeonBotInc.msgRetryCounterCache.clear()
            }

            try {
                await handleMessages(XeonBotInc, chatUpdate, true)
            } catch (err) {
                console.error("Error in handleMessages:", err.message || err)
            }
        } catch (err) {
            console.error("Error in messages.upsert:", err)
        }
    })

    XeonBotInc.decodeJid = (jid) => {
        if (!jid) return jid
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {}
            return decode.user && decode.server && decode.user + '@' + decode.server || jid
        } else return jid
    }

    XeonBotInc.ev.on('contacts.update', update => {
        for (let contact of update) {
            let id = XeonBotInc.decodeJid(contact.id)
            if (store && store.contacts) store.contacts[id] = { id, name: contact.notify }
        }
    })

    XeonBotInc.getName = (jid, withoutContact = false) => {
        id = XeonBotInc.decodeJid(jid)
        withoutContact = XeonBotInc.withoutContact || withoutContact
        let v
        if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
            v = store.contacts[id] || {}
            if (!(v.name || v.subject)) v = XeonBotInc.groupMetadata(id) || {}
            resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
        })
        else v = id === '0@s.whatsapp.net' ? {
            id,
            name: 'WhatsApp'
        } : id === XeonBotInc.decodeJid(XeonBotInc.user.id) ?
            XeonBotInc.user :
            (store.contacts[id] || {})
        return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
    }

    XeonBotInc.public = true

    XeonBotInc.serializeM = (m) => smsg(XeonBotInc, m, store)

    if (pairingCode && !XeonBotInc.authState.creds.registered) {
        if (useMobile) throw new Error('Cannot use pairing code with mobile api')

        let phoneNumber
        if (!!global.phoneNumber) {
            phoneNumber = global.phoneNumber
        } else {
            phoneNumber = await question(chalk.bgBlack(chalk.greenBright(`𝐌𝐄𝐓𝐓𝐄𝐙 𝐕𝐎𝐓𝐑𝐄 𝐍𝐔𝐌𝐄𝐑𝐎 𝐈𝐂𝐈 😍\n𝐅𝐎𝐑𝐌𝐀𝐓: 𝐍𝐎𝐓𝐑𝐄 𝐍𝐔𝐌𝐄𝐑𝐎 (𝐒𝐀𝐍𝐒 + 𝐍𝐈 𝐒𝐏𝐀𝐂𝐄𝐒) : `)))
        }

        phoneNumber = phoneNumber.replace(/[^0-9]/g, '')

        const pn = require('awesome-phonenumber');
        if (!pn('+' + phoneNumber).isValid()) {
            console.log(chalk.red('Invalid phone number. Please enter your full international number without + or spaces.'));
            process.exit(1);
        }

        setTimeout(async () => {
            try {
                let code = await XeonBotInc.requestPairingCode(phoneNumber)
                code = code?.match(/.{1,4}/g)?.join("-") || code
                console.log(chalk.black(chalk.bgGreen(`Your Pairing Code : `)), chalk.black(chalk.white(code)))
                console.log(chalk.yellow(`\nPlease enter this code in your WhatsApp app:\n1. Open WhatsApp\n2. Go to Settings > Linked Devices\n3. Tap "Link a Device"\n4. Enter the code shown above`))
            } catch (error) {
                console.error('Error requesting pairing code:', error)
                console.log(chalk.red('Failed to get pairing code. Please check your phone number and try again.'))
            }
        }, 3000)
    }

    XeonBotInc.ev.on('connection.update', async (s) => {
        const { connection, lastDisconnect, qr } = s
        
        if (qr) {
            console.log(chalk.yellow('📱 QR Code generated. Please scan with WhatsApp.'))
        }
        
        if (connection === 'connecting') {
            console.log(chalk.yellow('🔄 Connecting to WhatsApp...'))
        }
        
        if (connection == "open") {
            global.botConnected = true;
            console.log(chalk.magenta(` `))
            console.log(chalk.yellow(`🤩Connected to => ` + JSON.stringify(XeonBotInc.user, null, 2)))

            try {
                const botNumber = XeonBotInc.user.id.split(':')[0] + '@s.whatsapp.net';
                const settings = require('./settings');
                const { getCurrentPrefix } = require('./commands/setprefix');
                const p = getCurrentPrefix();
                const now = new Date();
                const timeStr = now.toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'medium' });
                const channelInfo = {
                    forwardingScore: 1, isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363408304719268@newsletter',
                        newsletterName: 'ITACHI-XMD', serverMessageId: -1
                    }
                };

                await XeonBotInc.sendMessage(botNumber, {
                    image: { url: 'https://i.ibb.co/ds0fdYCX/IMG-20260409-WA0249.jpg' },
                    caption: `╔══════════════════════╗\n║   🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗-𝐕2* 🥷   ║\n╠══════════════════════╣\n║   🟢 *BOT CONNECTÉ !*      ║\n╚══════════════════════╝\n\n🤖 *${settings.botName || 'ITACHI-XMD'}* est en ligne !\n\n┌──────────────────────\n│ ⏰ *Heure    :* ${timeStr}\n│ ✅ *Statut   :* En ligne & Prêt\n│ 📦 *Version  :* v${settings.version || '2.0.0'}\n│ ⚙️ *Préfixe  :* \`${p}\`\n│ 🌍 *Mode     :* Public\n└──────────────────────\n\n💡 *Commandes rapides :*\n┌──────────────────────\n│ ⬡ \`${p}menu\`  → Menu principal\n│ ⬡ \`${p}help\`  → Aide\n│ ⬡ \`${p}ping\`  → Test vitesse\n│ ⬡ \`${p}alive\` → État du bot\n└──────────────────────\n\n📢 *Rejoins notre chaîne officielle !*\n\n> _Propulsé par 🥷 *IBSACKO™ · CENTRAL HEX*_`,
                    contextInfo: channelInfo
                });
            } catch (error) {
                console.error('Error sending connection message:', error.message)
            }

            await delay(1999)
            console.log(chalk.yellow(`\n\n                  ${chalk.bold.blue(`[ ${global.botname || 'ITACHI-XMD'} ]`)}\n\n`))
            console.log(chalk.cyan(`< ================================================== >`))
            console.log(chalk.magenta(`\n${global.themeemoji || '•'} YT CHANNEL: Central Hex`))
            console.log(chalk.magenta(`${global.themeemoji || '•'} GITHUB: CentralHexMd`))
            console.log(chalk.magenta(`${global.themeemoji || '•'} WA NUMBER: ${owner}`))
            console.log(chalk.magenta(`${global.themeemoji || '•'} CREDIT: Central-Hex`))
            console.log(chalk.green(`${global.themeemoji || '•'} 🤖 Bot Connected Successfully! ✅`))
            console.log(chalk.blue(`Bot Version: ${settings.version}`))
        }
        
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut
            const statusCode = lastDisconnect?.error?.output?.statusCode
            
            console.log(chalk.red(`Connection closed due to ${lastDisconnect?.error}, reconnecting ${shouldReconnect}`))
            
            if (statusCode === DisconnectReason.loggedOut || statusCode === 401) {
                try {
                    rmSync('./session', { recursive: true, force: true })
                    console.log(chalk.yellow('Session folder deleted. Please re-authenticate.'))
                } catch (error) {
                    console.error('Error deleting session:', error)
                }
                console.log(chalk.red('Session logged out. Please re-authenticate.'))
            }
            
            if (shouldReconnect) {
                console.log(chalk.yellow('Reconnecting...'))
                await delay(5000)
                startXeonBotInc()
            }
        }
    })

    const antiCallNotified = new Set();

    XeonBotInc.ev.on('call', async (calls) => {
        try {
            const { readState: readAnticallState } = require('./commands/anticall');
            const state = readAnticallState();
            if (!state.enabled) return;
            for (const call of calls) {
                const callerJid = call.from || call.peerJid || call.chatId;
                if (!callerJid) continue;
                try {
                    try {
                        if (typeof XeonBotInc.rejectCall === 'function' && call.id) {
                            await XeonBotInc.rejectCall(call.id, callerJid);
                        } else if (typeof XeonBotInc.sendCallOfferAck === 'function' && call.id) {
                            await XeonBotInc.sendCallOfferAck(call.id, callerJid, 'reject');
                        }
                    } catch {}

                    if (!antiCallNotified.has(callerJid)) {
                        antiCallNotified.add(callerJid);
                        setTimeout(() => antiCallNotified.delete(callerJid), 60000);
                        await XeonBotInc.sendMessage(callerJid, { text: '📵 Anticall is enabled. Your call was rejected and you will be blocked.' });
                    }
                } catch {}
                setTimeout(async () => {
                    try { await XeonBotInc.updateBlockStatus(callerJid, 'block'); } catch {}
                }, 800);
            }
        } catch (e) {}
    });

    XeonBotInc.ev.on('group-participants.update', async (update) => {
        await handleGroupParticipantUpdate(XeonBotInc, update);
    });

    XeonBotInc.ev.on('messages.upsert', async (m) => {
        if (m.messages[0].key && m.messages[0].key.remoteJid === 'status@broadcast') {
            await handleStatus(XeonBotInc, m);
        }
    });

    XeonBotInc.ev.on('status.update', async (status) => {
        await handleStatus(XeonBotInc, status);
    });

    XeonBotInc.ev.on('messages.reaction', async (status) => {
        await handleStatus(XeonBotInc, status);
    });

    globalSocket = XeonBotInc;

    XeonBotInc.ev.on('connection.update', (update) => {
        if (update.qr) {
            qrStore['latest'] = update.qr;
            console.log('[API] QR Code mis à jour');
        }
        if (update.connection === 'open') {
            qrStore['latest'] = null;
        }
    });

    return XeonBotInc;
    } catch (error) {
        console.error('Error in startXeonBotInc:', error)
        await delay(5000)
        startXeonBotInc()
    }
}



// ═══════════════════════════════════════════════════════════
// 🌐 SERVEUR API — ITACHI-XMD Session Generator
// ═══════════════════════════════════════════════════════════
const http = require('http');
const url = require('url');

const sessionStore = {};
const qrStore = {};

function createApiServer(getSocket) {
    const PORT = process.env.API_PORT || 3000;

    const server = http.createServer(async (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Content-Type', 'application/json');

        if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }

        const parsed = url.parse(req.url, true);
        const urlPath = parsed.pathname;     // ✅ FIX: renommé de 'path' à 'urlPath'
        const query = parsed.query;

        try {
            // Route: GET /pair?phone=224621963059&type=short
            if (urlPath === '/pair') {       // ✅ FIX: urlPath partout
                const phone = (query.phone || '').replace(/\D/g, '');
                const type = query.type || 'short';

                if (!phone || phone.length < 8) {
                    res.writeHead(400);
                    return res.end(JSON.stringify({ error: 'Numéro invalide' }));
                }

                const sock = getSocket();
                if (!sock) {
                    res.writeHead(503);
                    return res.end(JSON.stringify({ error: 'Bot non connecté' }));
                }

                try {
                    const jid = phone + '@s.whatsapp.net';
                    const code = await sock.requestPairingCode(jid);
                    const formatted = code ? code.match(/.{1,4}/g)?.join('-') || code : null;

                    if (formatted) {
                        waitForSession(sock, phone, type, jid);
                        res.writeHead(200);
                        res.end(JSON.stringify({ code: formatted, phone }));
                    } else {
                        throw new Error('Code non reçu');
                    }
                } catch (e) {
                    console.error('[API/pair]', e.message);
                    res.writeHead(500);
                    res.end(JSON.stringify({ error: e.message }));
                }
            }

            else if (urlPath === '/session') {   // ✅ FIX: urlPath
                const phone = (query.phone || '').replace(/\D/g, '');
                const session = sessionStore[phone];
                if (session) {
                    res.writeHead(200);
                    res.end(JSON.stringify({ session }));
                } else {
                    res.writeHead(200);
                    res.end(JSON.stringify({ session: null, waiting: true }));
                }
            }

            else if (urlPath === '/qr') {        // ✅ FIX: urlPath
                const qrData = qrStore['latest'];
                if (qrData) {
                    res.writeHead(200);
                    res.end(JSON.stringify({ qr: qrData }));
                } else {
                    res.writeHead(200);
                    res.end(JSON.stringify({ qr: null, message: 'QR pas encore disponible, réessaie dans 3s' }));
                }
            }

            else if (urlPath === '/qr-session') { // ✅ FIX: urlPath
                const session = sessionStore['qr-session'];
                res.writeHead(200);
                res.end(JSON.stringify({ session: session || null }));
            }

            else if (urlPath === '/status') {    // ✅ FIX: urlPath
                const sock = getSocket();
                res.writeHead(200);
                res.end(JSON.stringify({
                    online: !!sock,
                    bot: 'ITACHI-XMD',
                    version: '2.0.0',
                    uptime: Math.floor(process.uptime())
                }));
            }

            else {
                res.writeHead(404);
                res.end(JSON.stringify({ error: 'Route non trouvée' }));
            }
        } catch (e) {
            console.error('[API Error]', e);
            res.writeHead(500);
            res.end(JSON.stringify({ error: 'Erreur interne' }));
        }
    });

    server.listen(PORT, () => {
        console.log(chalk.green(`🌐 API Session Server → http://localhost:${PORT}`));
    });

    return server;
}

function waitForSession(sock, phone, type, jid) {
    console.log(`[API] En attente de session pour ${phone}...`);
    
    const timeout = setTimeout(() => {
        if (!sessionStore[phone]) {
            console.log(`[API] Timeout session pour ${phone}`);
        }
    }, 120000);

    const listener = async () => {
        try {
            const sessionData = fs.readFileSync('./session/creds.json', 'utf8');
            if (sessionData) {
                let sessionId;
                if (type === 'short') {
                    sessionId = 'itachi~' + Buffer.from(sessionData).toString('base64').substring(0, 100);
                } else {
                    sessionId = sessionData;
                }
                sessionStore[phone] = sessionId;
                clearTimeout(timeout);
                console.log(`✅ [API] Session générée pour ${phone}`);
                
                await sock.sendMessage(jid, {
                    text: `╔═════════════════════╗
║   🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗-𝐕2* 🥷   ║
╚═════════════════════╝

✅ *Session générée !*

\`\`\`${sessionId}\`\`\`

> Copie et colle dans ta variable SESSION_ID 🥷`
                });
            }
        } catch (e) {}
    };

    setTimeout(listener, 5000);
    setTimeout(listener, 10000);
    setTimeout(listener, 20000);
    setTimeout(listener, 30000);
}

let globalSocket = null;

createApiServer(() => globalSocket);

startXeonBotInc().catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
})

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err)
})

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err)
})

let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(chalk.redBright(`Update ${__filename}`))
    delete require.cache[file]
    require(file)
})
