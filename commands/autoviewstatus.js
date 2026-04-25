// Autoviewstatus → Le bot regarde automatiquement tous les statuts
const fs = require('fs');
const path = require('path');
const isOwnerOrSudo = require('../lib/isOwner');

const configPath = path.join(__dirname, '../data/autoStatus.json');
const channelInfo = {
    forwardingScore: 1, isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363408304719268@newsletter',
        newsletterName: 'ITACHI-XMD', serverMessageId: -1
    }
};

if (!fs.existsSync(configPath)) fs.writeFileSync(configPath, JSON.stringify({ activé: false, reactOn: false }));
function getConfig() { try { return JSON.parse(fs.readFileSync(configPath)); } catch { return { activé: false }; } }
function saveConfig(d) { fs.writeFileSync(configPath, JSON.stringify(d, null, 2)); }

async function autoviewstatusCommand(sock, chatId, senderId, args, message) {
    let config = getConfig();
    const action = args[0]?.toLowerCase();
    const current = config.activé ? '🟢 Activé' : '🔴 Désactivé';

    if (!action) {
        return await sock.sendMessage(chatId, {
            image: { url: 'https://i.ibb.co/zTpCpsDD/54c381553462489288313ec73a0bbfe8.jpg' },
            caption: `╔═══════════════════════╗\n║  🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗 v2.0* 🥷  ║\n╠═══════════════════════╣\n║   👁️ *AUTO VIEW STATUS*   ║\n╚═══════════════════════╝\n\n📊 *Statut :* ${current}\n\n📌 *Commandes :*\n┌──────────────────────\n│ ⬡ .autoviewstatus on\n│ ⬡ .autoviewstatus off\n└──────────────────────\n\n👁️ *Fonctionnement :*\n┌──────────────────────\n│ Quand activé, le bot visionne\n│ automatiquement TOUS les\n│ statuts de tes contacts,\n│ comme si tu les regardais toi-même.\n└──────────────────────\n\n> _Propulsé par 🥷 IBSACKO™_`,
            contextInfo: channelInfo
        }, { quoted: message });
    }

    config.activé = action === 'on';
    saveConfig(config);
    const status = action === 'on' ? '🟢 Activé' : '🔴 Désactivé';

    return await sock.sendMessage(chatId, {
        text: `╔═══════════════════════╗\n║  🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗 v2.0* 🥷  ║\n╚═══════════════════════╝\n\n👁️ *Auto View Status :* ${status}\n\n${action === 'on' ? '> _Le bot regardera automatiquement tous les statuts._' : '> _La vue automatique des statuts est désactivée._'}`,
        contextInfo: channelInfo
    }, { quoted: message });
}

module.exports = autoviewstatusCommand;
