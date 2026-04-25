// Antimention → Empêche le spam de mentions dans le groupe
const fs = require('fs');
const path = require('path');
const isAdmin = require('../lib/isAdmin');

const configPath = path.join(__dirname, '../data/antimention.json');
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

async function antimentionCommand(sock, chatId, senderId, args, message) {
    if (!chatId.endsWith('@g.us')) {
        return await sock.sendMessage(chatId, { text: '❌ *Uniquement dans les groupes !*', contextInfo: channelInfo }, { quoted: message });
    }

    const config = getConfig();
    const action = args[0]?.toLowerCase();
    const threshold = config[chatId]?.threshold || 5;
    const current = config[chatId]?.enabled ? '🟢 Activé' : '🔴 Désactivé';

    if (!action) {
        return await sock.sendMessage(chatId, {
            image: { url: 'https://i.ibb.co/zTpCpsDD/54c381553462489288313ec73a0bbfe8.jpg' },
            caption: `╔═══════════════════════╗\n║  🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗 v2.0* 🥷  ║\n╠═══════════════════════╣\n║   ❌ *ANTI-MENTION*       ║\n╚═══════════════════════╝\n\n📊 *Statut :* ${current}\n🔢 *Seuil de mentions :* ${threshold}\n\n📌 *Commandes :*\n┌──────────────────────\n│ ⬡ .antimention on\n│ ⬡ .antimention off\n│ ⬡ .antimention seuil <nombre>\n│   _Définir le nb max de mentions_\n└──────────────────────\n\n🛡️ *Fonctionnement :*\n┌──────────────────────\n│ Si un membre (non-admin) mentionne\n│ plus de ${threshold} personnes dans un\n│ message, il est supprimé\n│ et le membre averti.\n└──────────────────────\n\n> _Propulsé par 🥷 IBSACKO™_`,
            contextInfo: channelInfo
        }, { quoted: message });
    }

    if (!config[chatId]) config[chatId] = { enabled: false, threshold: 5 };

    if (action === 'on') {
        config[chatId].enabled = true;
        saveConfig(config);
        return await sock.sendMessage(chatId, {
            text: `╔═══════════════════════╗\n║  🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗 v2.0* 🥷  ║\n╚═══════════════════════╝\n\n❌ *Anti-Mention :* 🟢 Activé\n🔢 *Seuil :* ${config[chatId].threshold} mentions max\n\n> _Les spams de mentions seront supprimés._`,
            contextInfo: channelInfo
        }, { quoted: message });
    }
    if (action === 'off') {
        config[chatId].enabled = false;
        saveConfig(config);
        return await sock.sendMessage(chatId, {
            text: `╔═══════════════════════╗\n║  🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗 v2.0* 🥷  ║\n╚═══════════════════════╝\n\n❌ *Anti-Mention :* 🔴 Désactivé`,
            contextInfo: channelInfo
        }, { quoted: message });
    }
    if (action === 'seuil') {
        const num = parseInt(args[1]);
        if (!num || num < 1) return await sock.sendMessage(chatId, { text: '❌ *Seuil invalide !*\n_Ex : .antimention seuil 3_', contextInfo: channelInfo }, { quoted: message });
        config[chatId].threshold = num;
        saveConfig(config);
        return await sock.sendMessage(chatId, {
            text: `✅ *Seuil mis à jour :* ${num} mentions maximum par message.`, contextInfo: channelInfo
        }, { quoted: message });
    }
}

// Handler appelé depuis main.js
async function handleAntimention(sock, chatId, senderId, mentionedJids, message) {
    const config = getConfig();
    if (!config[chatId]?.enabled) return false;
    const { isSenderAdmin } = await isAdmin(sock, chatId, senderId);
    if (isSenderAdmin) return false;
    const threshold = config[chatId]?.threshold || 5;
    if (!mentionedJids || mentionedJids.length < threshold) return false;
    try {
        await sock.sendMessage(chatId, { delete: message.key });
        await sock.sendMessage(chatId, {
            text: `╔═══════════════════════╗\n║  🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗 v2.0* 🥷  ║\n╚═══════════════════════╝\n\n⚠️ *Spam de mentions détecté !*\n@${senderId.split('@')[0]} a mentionné *${mentionedJids.length}* membres.\n\n🚫 _Message supprimé automatiquement._`,
            mentions: [senderId],
            contextInfo: channelInfo
        });
        return true;
    } catch (e) { return false; }
}

module.exports = antimentionCommand;
module.exports.handleAntimention = handleAntimention;
