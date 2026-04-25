// Hidetag → Mentionne tous les membres sans afficher leurs noms
const isAdmin = require('../lib/isAdmin');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

const channelInfo = {
    forwardingScore: 1, isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363408304719268@newsletter',
        newsletterName: 'ITACHI-XMD', serverMessageId: -1
    }
};

async function hideTagCommand(sock, chatId, senderId, messageText, replyMessage, message) {
    if (!chatId.endsWith('@g.us')) {
        return await sock.sendMessage(chatId, { text: '❌ *Uniquement dans les groupes !*', contextInfo: channelInfo }, { quoted: message });
    }


    const meta = await sock.groupMetadata(chatId);
    const participants = meta.participants || [];
    // Inclut TOUS les membres (le "hide" = pas de @nom visible dans le texte)
    const mentions = participants.map(p => p.id);

    const text = messageText ||
        `╔═══════════════════════╗\n║  🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗 v2.0* 🥷  ║\n╠═══════════════════════╣\n║   😈 *HIDE TAG*           ║\n╚═══════════════════════╝\n\n👥 *${meta.subject}*\n🔔 *${mentions.length} membres notifiés silencieusement*\n\n> _Propulsé par 🥷 IBSACKO™_`;

    try {
        if (replyMessage) {
            if (replyMessage.imageMessage) {
                const stream = await downloadContentFromMessage(replyMessage.imageMessage, 'image');
                let buf = Buffer.from([]);
                for await (const chunk of stream) buf = Buffer.concat([buf, chunk]);
                await sock.sendMessage(chatId, { image: buf, caption: text, mentions });
            } else if (replyMessage.videoMessage) {
                const stream = await downloadContentFromMessage(replyMessage.videoMessage, 'video');
                let buf = Buffer.from([]);
                for await (const chunk of stream) buf = Buffer.concat([buf, chunk]);
                await sock.sendMessage(chatId, { video: buf, caption: text, mentions });
            } else {
                const content = replyMessage.conversation || replyMessage.extendedTextMessage?.text || text;
                await sock.sendMessage(chatId, { text: content, mentions });
            }
        } else {
            await sock.sendMessage(chatId, {
                image: { url: 'https://i.ibb.co/zTpCpsDD/54c381553462489288313ec73a0bbfe8.jpg' },
                caption: text, mentions, contextInfo: channelInfo
            });
        }
    } catch (e) {
        console.error('❌ [hidetag]', e.message);
        await sock.sendMessage(chatId, { text, mentions });
    }
}

module.exports = hideTagCommand;
