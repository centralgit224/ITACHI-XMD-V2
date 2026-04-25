// Open → Ouvre le groupe (tout le monde peut écrire)
const isAdmin = require('../lib/isAdmin');

const channelInfo = {
    forwardingScore: 1, isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363408304719268@newsletter',
        newsletterName: 'ITACHI-XMD', serverMessageId: -1
    }
};

async function openCommand(sock, chatId, senderId, message) {
    if (!chatId.endsWith('@g.us')) {
        return await sock.sendMessage(chatId, { text: '❌ *Uniquement dans les groupes !*', contextInfo: channelInfo }, { quoted: message });
    }

    try {
        // Déverrouille le groupe : tout le monde peut envoyer
        await sock.groupSettingUpdate(chatId, 'not_announcement');
        const meta = await sock.groupMetadata(chatId);

        await sock.sendMessage(chatId, {
            image: { url: 'https://i.ibb.co/zTpCpsDD/54c381553462489288313ec73a0bbfe8.jpg' },
            caption: `╔═══════════════════════╗\n║  🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗 v2.0* 🥷  ║\n╠═══════════════════════╣\n║   🔓 *GROUPE OUVERT*     ║\n╚═══════════════════════╝\n\n👥 *${meta.subject}*\n\n┌──────────────────────\n│ 🔓 Statut : *Ouvert*\n│ 🌍 Tout le monde peut écrire\n│ 📅 Ouvert par @${senderId.split('@')[0]}\n└──────────────────────\n\n> _Pour fermer : .close_\n> _Propulsé par 🥷 IBSACKO™_`,
            mentions: [senderId],
            contextInfo: channelInfo
        }, { quoted: message });
    } catch (e) {
        console.error('❌ [open]', e.message);
        await sock.sendMessage(chatId, { text: '❌ *Impossible d\'ouvrir le groupe.*\n_Vérifiez les permissions du bot._', contextInfo: channelInfo }, { quoted: message });
    }
}

module.exports = openCommand;
