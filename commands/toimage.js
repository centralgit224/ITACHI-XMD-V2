const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const sharp = require('sharp');

const channelInfo = {
    forwardingScore: 1, isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363408304719268@newsletter',
        newsletterName: 'ITACHI-XMD', serverMessageId: -1
    }
};

async function toimageCommand(sock, chatId, replyMessage, message) {
    if (!replyMessage?.stickerMessage) {
        return await sock.sendMessage(chatId, {
            text: `╔══════════════════════╗\n║   🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗* 🥷   ║\n╚══════════════════════╝\n\n🖼️ *Sticker → Image*\n\n💡 *Usage :* Réponds à un *sticker* avec *.toimage*`,
            contextInfo: channelInfo
        }, { quoted: message });
    }

    try {
        await sock.sendMessage(chatId, { text: `⏳ _Conversion en cours..._` }, { quoted: message });

        const stream = await downloadContentFromMessage(replyMessage.stickerMessage, 'sticker');
        let buf = Buffer.from([]);
        for await (const chunk of stream) buf = Buffer.concat([buf, chunk]);

        // Convertir WebP → PNG
        const pngBuffer = await sharp(buf).png().toBuffer();

        await sock.sendMessage(chatId, {
            image: pngBuffer,
            caption: `╔══════════════════════╗\n║   🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗* 🥷   ║\n╠══════════════════════╣\n║  🖼️ *STICKER → IMAGE*  ║\n╚══════════════════════╝\n\n✅ *Conversion réussie !*\n\n> _Propulsé par 🥷 IBSACKO™_`,
            contextInfo: channelInfo
        }, { quoted: message });

    } catch (e) {
        console.error('❌ [toimage]', e.message);
        await sock.sendMessage(chatId, {
            text: `❌ *Erreur lors de la conversion.*\n_Assurez-vous de répondre à un sticker valide._`,
            contextInfo: channelInfo
        }, { quoted: message });
    }
}

module.exports = toimageCommand;
