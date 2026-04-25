// Autoreactstatus → Réagit automatiquement aux statuts avec des emojis
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

const REACTIONS = ['🥷', '❤️', '🔥', '👏', '😍', '💯', '⚡', '🎯', '👑', '✨'];

if (!fs.existsSync(configPath)) fs.writeFileSync(configPath, JSON.stringify({ activé: false, reactOn: false }));
function getConfig() { try { return JSON.parse(fs.readFileSync(configPath)); } catch { return { activé: false, reactOn: false }; } }
function saveConfig(d) { fs.writeFileSync(configPath, JSON.stringify(d, null, 2)); }

async function autoreactstatusCommand(sock, chatId, senderId, args, message) {
    const config = getConfig();
    const action = args[0]?.toLowerCase();
    const current = config.reactOn ? '🟢 Activé' : '🔴 Désactivé';

    if (!action) {
        return await sock.sendMessage(chatId, {
            image: { url: 'https://i.ibb.co/zTpCpsDD/54c381553462489288313ec73a0bbfe8.jpg' },
            caption: `╔═══════════════════════╗\n║  🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗 v2.0* 🥷  ║\n╠═══════════════════════╣\n║  🔥 *AUTO REACT STATUS*   ║\n╚═══════════════════════╝\n\n📊 *Statut :* ${current}\n\n😀 *Réactions utilisées :*\n┌──────────────────────\n│ ${REACTIONS.join('  ')}\n└──────────────────────\n\n📌 *Commandes :*\n┌──────────────────────\n│ ⬡ .autoreactstatus on\n│ ⬡ .autoreactstatus off\n└──────────────────────\n\n🔥 *Fonctionnement :*\n┌──────────────────────\n│ Le bot réagit automatiquement\n│ avec un emoji aléatoire à\n│ chaque nouveau statut posté\n│ par tes contacts WhatsApp.\n└──────────────────────\n\n> _Propulsé par 🥷 IBSACKO™_`,
            contextInfo: channelInfo
        }, { quoted: message });
    }

    config.reactOn = action === 'on';
    saveConfig(config);
    const status = action === 'on' ? '🟢 Activé' : '🔴 Désactivé';

    return await sock.sendMessage(chatId, {
        text: `╔═══════════════════════╗\n║  🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗 v2.0* 🥷  ║\n╚═══════════════════════╝\n\n🔥 *Auto React Status :* ${status}\n\n${action === 'on' ? '> _Le bot réagira à tous les statuts avec un emoji._' : '> _Les réactions automatiques sont désactivées._'}`,
        contextInfo: channelInfo
    }, { quoted: message });
}

// Handler appelé depuis main.js quand un statut est reçu
async function handleAutoReact(sock, statusMessage) {
    const config = getConfig();
    if (!config.reactOn) return;
    try {
        const emoji = REACTIONS[Math.floor(Math.random() * REACTIONS.length)];
        await sock.sendMessage('status@broadcast', {
            react: { text: emoji, key: statusMessage.key }
        });
    } catch (e) {
        console.error('❌ [autoreactstatus]', e.message);
    }
}

module.exports = autoreactstatusCommand;
module.exports.handleAutoReact = handleAutoReact;
