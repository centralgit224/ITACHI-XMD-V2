// Autotyping → Simule que le bot est en train d'écrire avant chaque réponse
const fs = require('fs');
const path = require('path');
const isOwnerOrSudo = require('../lib/isOwner');

const configPath = path.join(__dirname, '../data/autotyping.json');
const channelInfo = {
    forwardingScore: 1, isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363408304719268@newsletter',
        newsletterName: 'ITACHI-XMD', serverMessageId: -1
    }
};

if (!fs.existsSync(configPath)) fs.writeFileSync(configPath, JSON.stringify({ enabled: false }));
function getConfig() { try { return JSON.parse(fs.readFileSync(configPath)); } catch { return { enabled: false }; } }
function saveConfig(d) { fs.writeFileSync(configPath, JSON.stringify(d, null, 2)); }

async function autotypingCommand(sock, chatId, message) {
    const text = message.message?.conversation || message.message?.extendedTextMessage?.text || '';
    const args = text.split(' ').slice(1);
    const config = getConfig();
    const action = args[0]?.toLowerCase();
    const current = config.enabled ? '🟢 Activé' : '🔴 Désactivé';

    if (!action) {
        return await sock.sendMessage(chatId, {
            image: { url: 'https://i.ibb.co/zTpCpsDD/54c381553462489288313ec73a0bbfe8.jpg' },
            caption: `╔═══════════════════════╗\n║  🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗 v2.0* 🥷  ║\n╠═══════════════════════╣\n║   ✍️ *AUTO TYPING*        ║\n╚═══════════════════════╝\n\n📊 *Statut :* ${current}\n\n📌 *Commandes :*\n┌──────────────────────\n│ ⬡ .autotyping on\n│ ⬡ .autotyping off\n└──────────────────────\n\nℹ️ Simule l'indicateur *"en train d'écrire..."* avant chaque réponse.\n\n> _Propulsé par 🥷 IBSACKO™_`,
            contextInfo: channelInfo
        }, { quoted: message });
    }

    config.enabled = action === 'on';
    saveConfig(config);
    const status = action === 'on' ? '🟢 Activé' : '🔴 Désactivé';

    return await sock.sendMessage(chatId, {
        text: `✍️ *Auto Typing :* ${status}`,
        contextInfo: channelInfo
    }, { quoted: message });
}

function isAutotypingEnabled() { return getConfig().enabled; }

// Toutes les fonctions attendues par main.js
async function handleAutotypingForMessage(sock, chatId, userMessage) {
    if (!getConfig().enabled) return;
    try {
        await sock.sendPresenceUpdate('composing', chatId);
        await new Promise(r => setTimeout(r, 800));
        await sock.sendPresenceUpdate('available', chatId);
    } catch (e) { /* silently fail */ }
}

async function handleAutotypingForCommand(sock, chatId) {
    if (!getConfig().enabled) return;
    try {
        await sock.sendPresenceUpdate('composing', chatId);
    } catch (e) { /* silently fail */ }
}

async function showTypingAfterCommand(sock, chatId) {
    if (!getConfig().enabled) return;
    try {
        await sock.sendPresenceUpdate('composing', chatId);
        await new Promise(r => setTimeout(r, 500));
        await sock.sendPresenceUpdate('available', chatId);
    } catch (e) { /* silently fail */ }
}

// Export compatible avec l'original
module.exports = autotypingCommand;
module.exports.autotypingCommand = autotypingCommand;
module.exports.isAutotypingEnabled = isAutotypingEnabled;
module.exports.handleAutotypingForMessage = handleAutotypingForMessage;
module.exports.handleAutotypingForCommand = handleAutotypingForCommand;
module.exports.showTypingAfterCommand = showTypingAfterCommand;
