const isOwnerOrSudo = require('../lib/isOwner');
const { addSudo } = require('../lib/index');

const channelInfo = {
    forwardingScore: 1, isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363408304719268@newsletter',
        newsletterName: 'ITACHI-XMD', serverMessageId: -1
    }
};

async function setsudoCommand(sock, chatId, senderId, args, replyMessage, message) {
    const isOwner = await isOwnerOrSudo(senderId, sock, chatId);
    if (!isOwner) {
        return await sock.sendMessage(chatId, {
            text: `❌ *Réservé au propriétaire !*`, contextInfo: channelInfo
        }, { quoted: message });
    }

    let targetJid = null;
    if (replyMessage) {
        const participant = message?.message?.extendedTextMessage?.contextInfo?.participant;
        if (participant) targetJid = participant;
    } else if (args[0]) {
        const num = args[0].replace(/[^0-9]/g, '');
        if (num) targetJid = num + '@s.whatsapp.net';
    }

    if (!targetJid) {
        return await sock.sendMessage(chatId, {
            text: `╔══════════════════════╗\n║   🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗* 🥷   ║\n╚══════════════════════╝\n\n👑 *Ajouter un Sudo*\n\n💡 *Usage :*\n┌──────────────────────\n│ ⬡ .setsudo @mention\n│ ⬡ .setsudo <numéro>\n│ ⬡ Réponds à un message\n└──────────────────────`,
            contextInfo: channelInfo
        }, { quoted: message });
    }

    try {
        await addSudo(targetJid);
        const num = targetJid.split('@')[0];
        return await sock.sendMessage(chatId, {
            image: { url: 'https://i.ibb.co/zTpCpsDD/54c381553462489288313ec73a0bbfe8.jpg' },
            caption: `╔══════════════════════╗\n║   🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗* 🥷   ║\n╠══════════════════════╣\n║   👑 *SUDO AJOUTÉ*     ║\n╚══════════════════════╝\n\n✅ *+${num}* est maintenant sudo !\n👑 Il peut utiliser les commandes owner.\n\n> _Propulsé par 🥷 IBSACKO™_`,
            contextInfo: channelInfo
        }, { quoted: message });
    } catch (e) {
        return await sock.sendMessage(chatId, { text: `❌ *Erreur :* ${e.message}`, contextInfo: channelInfo }, { quoted: message });
    }
}

module.exports = setsudoCommand;
