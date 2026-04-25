// Antileave → Envoie un message automatique quand un membre quitte + tente de réinviter
const fs = require('fs');
const path = require('path');
const isAdmin = require('../lib/isAdmin');

const configPath = path.join(__dirname, '../data/antileave.json');
const channelInfo = {
    forwardingScore: 1, isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363408304719268@newsletter',
        newsletterName: 'ITACHI-XMD', serverMessageId: -1
    }
};

if (!fs.existsSync(configPath)) fs.writeFileSync(configPath, JSON.stringify({}));
function getConfig() { try { return JSON.parse(fs.readFileSync(configPath)); } catch { return {}; } }
function saveConfig(d) { fs.writeFileSync(configPath, JSON.stringify(d, null, 2)); }

async function antileaveCommand(sock, chatId, senderId, args, message) {
    if (!chatId.endsWith('@g.us')) {
        return await sock.sendMessage(chatId, { text: '❌ *Uniquement dans les groupes !*', contextInfo: channelInfo }, { quoted: message });
    }

    const { isSenderAdmin } = await isAdmin(sock, chatId, senderId);
    if (!isSenderAdmin) {
        return await sock.sendMessage(chatId, {
            text: `╔══════════════════════╗\n║   🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗* 🥷   ║\n╚══════════════════════╝\n\n❌ *Réservé aux admins du groupe !*`,
            contextInfo: channelInfo
        }, { quoted: message });
    }

    const config = getConfig();
    const action = args[0]?.toLowerCase();
    const current = config[chatId]?.enabled ? '🟢 Activé' : '🔴 Désactivé';

    if (!action) {
        return await sock.sendMessage(chatId, {
            image: { url: 'https://i.ibb.co/zTpCpsDD/54c381553462489288313ec73a0bbfe8.jpg' },
            caption: `╔═══════════════════════╗\n║  🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗 v2.0* 🥷  ║\n╠═══════════════════════╣\n║    🚫 *ANTI-LEAVE*       ║\n╚═══════════════════════╝\n\n📊 *Statut :* ${current}\n\n📌 *Commandes :*\n┌──────────────────────\n│ ⬡ .antileave on\n│ ⬡ .antileave off\n└──────────────────────\n\nℹ️ *Fonctionnement :*\n┌──────────────────────\n│ • Envoie un message d'alerte\n│   quand un membre quitte\n│ • Tente de réinviter le membre\n│   si le bot est admin\n└──────────────────────\n\n> _Propulsé par 🥷 IBSACKO™_`,
            contextInfo: channelInfo
        }, { quoted: message });
    }

    if (!config[chatId]) config[chatId] = {};
    if (action === 'on') {
        config[chatId].enabled = true;
        saveConfig(config);
        return await sock.sendMessage(chatId, {
            text: `╔══════════════════════╗\n║   🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗* 🥷   ║\n╚══════════════════════╝\n\n🚫 *Anti-Leave :* 🟢 Activé\n\n> _Le bot alertera lors de chaque départ._`,
            contextInfo: channelInfo
        }, { quoted: message });
    }
    if (action === 'off') {
        config[chatId].enabled = false;
        saveConfig(config);
        return await sock.sendMessage(chatId, {
            text: `╔══════════════════════╗\n║   🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗* 🥷   ║\n╚══════════════════════╝\n\n🚫 *Anti-Leave :* 🔴 Désactivé`,
            contextInfo: channelInfo
        }, { quoted: message });
    }
}

// Handler appelé depuis main.js lors d'un départ (remove)
async function handleAntileave(sock, chatId, participantJid) {
    const config = getConfig();
    if (!config[chatId]?.enabled) return;
    const num = participantJid.split('@')[0];
    try {
        // Message d'alerte dans le groupe
        await sock.sendMessage(chatId, {
            image: { url: 'https://i.ibb.co/hRLmqqL3/db1a6a35f63a2a65d94987e71b6caa89.jpg' },
            caption: `╔═══════════════════════╗\n║  🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗 v2.0* 🥷  ║\n╠═══════════════════════╣\n║    🚪 *DÉPART DÉTECTÉ*   ║\n╚═══════════════════════╝\n\n😢 *+${num}* a quitté le groupe !\n\n┌──────────────────────\n│ 🚫 Anti-Leave actif\n│ 🔄 Tentative de réinvitation...\n└──────────────────────\n\n> _Propulsé par 🥷 IBSACKO™_`
        });
        // Tente de réinviter
        await new Promise(r => setTimeout(r, 2000));
        await sock.groupParticipantsUpdate(chatId, [participantJid], 'add');
    } catch (e) {
        console.error('❌ [antileave handler]', e.message);
    }
}

module.exports = antileaveCommand;
module.exports.handleAntileave = handleAntileave;
