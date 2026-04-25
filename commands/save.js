const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');

const channelInfo = {
    forwardingScore: 1, isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363408304719268@newsletter',
        newsletterName: 'ITACHI-XMD', serverMessageId: -1
    }
};

async function saveCommand(sock, chatId, senderId, replyMessage, message) {
    if (!replyMessage) {
        return await sock.sendMessage(chatId, {
            text: `╔══════════════════════╗\n║   🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗* 🥷   ║\n╚══════════════════════╝\n\n💾 *Sauvegarder un message*\n\n💡 *Usage :* Réponds à un message avec *.save*\n_Fonctionne avec : texte, image, vidéo, audio, sticker_`,
            contextInfo: channelInfo
        }, { quoted: message });
    }

    try {
        // Texte
        if (replyMessage.conversation || replyMessage.extendedTextMessage) {
            const text = replyMessage.conversation || replyMessage.extendedTextMessage?.text;
            await sock.sendMessage(senderId, {
                text: `╔══════════════════════╗\n║   🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗* 🥷   ║\n╠══════════════════════╣\n║   💾 *MESSAGE SAUVÉ*   ║\n╚══════════════════════╝\n\n📝 *Contenu :*\n${text}`,
                contextInfo: channelInfo
            });
            return await sock.sendMessage(chatId, {
                text: `✅ *Message texte sauvegardé !*\n_Envoyé dans votre MP._`,
                contextInfo: channelInfo
            }, { quoted: message });
        }

        // Image
        if (replyMessage.imageMessage) {
            const stream = await downloadContentFromMessage(replyMessage.imageMessage, 'image');
            let buf = Buffer.from([]);
            for await (const chunk of stream) buf = Buffer.concat([buf, chunk]);
            await sock.sendMessage(senderId, {
                image: buf,
                caption: `╔══════════════════════╗\n║   🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗* 🥷   ║\n╠══════════════════════╣\n║   💾 *IMAGE SAUVÉE*    ║\n╚══════════════════════╝`,
                contextInfo: channelInfo
            });
            return await sock.sendMessage(chatId, { text: `✅ *Image sauvegardée dans votre MP !*`, contextInfo: channelInfo }, { quoted: message });
        }

        // Vidéo
        if (replyMessage.videoMessage) {
            const stream = await downloadContentFromMessage(replyMessage.videoMessage, 'video');
            let buf = Buffer.from([]);
            for await (const chunk of stream) buf = Buffer.concat([buf, chunk]);
            await sock.sendMessage(senderId, {
                video: buf,
                caption: `╔══════════════════════╗\n║   🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗* 🥷   ║\n╠══════════════════════╣\n║   💾 *VIDÉO SAUVÉE*    ║\n╚══════════════════════╝`,
                contextInfo: channelInfo
            });
            return await sock.sendMessage(chatId, { text: `✅ *Vidéo sauvegardée dans votre MP !*`, contextInfo: channelInfo }, { quoted: message });
        }

        // Audio
        if (replyMessage.audioMessage) {
            const stream = await downloadContentFromMessage(replyMessage.audioMessage, 'audio');
            let buf = Buffer.from([]);
            for await (const chunk of stream) buf = Buffer.concat([buf, chunk]);
            await sock.sendMessage(senderId, { audio: buf, mimetype: 'audio/mp4', contextInfo: channelInfo });
            return await sock.sendMessage(chatId, { text: `✅ *Audio sauvegardé dans votre MP !*`, contextInfo: channelInfo }, { quoted: message });
        }

        // Sticker
        if (replyMessage.stickerMessage) {
            const stream = await downloadContentFromMessage(replyMessage.stickerMessage, 'sticker');
            let buf = Buffer.from([]);
            for await (const chunk of stream) buf = Buffer.concat([buf, chunk]);
            await sock.sendMessage(senderId, { sticker: buf, contextInfo: channelInfo });
            return await sock.sendMessage(chatId, { text: `✅ *Sticker sauvegardé dans votre MP !*`, contextInfo: channelInfo }, { quoted: message });
        }

        await sock.sendMessage(chatId, { text: `❌ *Type de message non supporté.*`, contextInfo: channelInfo }, { quoted: message });

    } catch (e) {
        console.error('❌ [save]', e.message);
        await sock.sendMessage(chatId, { text: `❌ *Erreur lors de la sauvegarde.*`, contextInfo: channelInfo }, { quoted: message });
    }
}

module.exports = saveCommand;
