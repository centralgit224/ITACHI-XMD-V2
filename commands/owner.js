const settings = require('../settings');

const channelInfo = {
    forwardingScore: 1, isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363408304719268@newsletter',
        newsletterName: 'ITACHI-XMD', serverMessageId: -1
    }
};

const BOT_IMAGE = 'https://i.ibb.co/hRLmqqL3/db1a6a35f63a2a65d94987e71b6caa89.jpg';

async function ownerCommand(sock, chatId, message) {
    const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${settings.botOwner}\nTEL;waid=${settings.ownerNumber}:${settings.ownerNumber}\nEND:VCARD`;

    const caption = `┏━━━━━━━━━━━━━━━━━━━━━━┓
┃  🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗 v2.0* 🥷  ┃
┗━━━━━━━━━━━━━━━━━━━━━━┛

👑 *PROPRIÉTAIRE DU BOT*
━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────
│ 👤 *Nom     :* ${settings.botOwner}
│ 📞 *Contact :* +${settings.ownerNumber}
│ 🤖 *Bot     :* ${settings.botName}
│ 📦 *Version :* v${settings.version}
└─────────────────────

━━━━━━━━━━━━━━━━━━━━━━
🥷 *À propos :*
┌─────────────────────
│ ⬡ Bot WhatsApp multifonctions
│ ⬡ +33 nouvelles commandes v2.0
│ ⬡ Protection avancée des groupes
│ ⬡ IA intégrée & Téléchargements
│ ⬡ 8 thèmes personnalisables
└─────────────────────

━━━━━━━━━━━━━━━━━━━━━━
📲 *Contacte le proprio ci-dessous* 👇

> _Propulsé par 🥷 *IBSACKO™*_`;

    try {
        await sock.sendMessage(chatId, {
            image: { url: BOT_IMAGE },
            caption,
            contextInfo: channelInfo
        }, { quoted: message });

        await sock.sendMessage(chatId, {
            contacts: { displayName: settings.botOwner, contacts: [{ vcard }] }
        });
    } catch (e) {
        console.error('❌ [owner]', e.message);
        await sock.sendMessage(chatId, { text: caption, contextInfo: channelInfo }, { quoted: message });
    }
}

module.exports = ownerCommand;
