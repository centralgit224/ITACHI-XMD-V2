// Take → Modifie le nom et le pack d'un sticker existant
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const webp = require('node-webpmux');
const crypto = require('crypto');
const settings = require('../settings');

const channelInfo = {
    forwardingScore: 1, isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363408304719268@newsletter',
        newsletterName: 'ITACHI-XMD', serverMessageId: -1
    }
};

async function takeCommand(sock, chatId, senderId, args, message) {
    const replyMsg = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;

    if (!replyMsg?.stickerMessage) {
        return await sock.sendMessage(chatId, {
            image: { url: 'https://i.ibb.co/zTpCpsDD/54c381553462489288313ec73a0bbfe8.jpg' },
            caption: `╔═══════════════════════╗\n║  🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗 v2.0* 🥷  ║\n╠═══════════════════════╣\n║   🧩 *MODIFIER STICKER*   ║\n╚═══════════════════════╝\n\n💡 *Usage :* Réponds à un *sticker* avec :\n┌──────────────────────\n│ ⬡ .take → Nom par défaut\n│ ⬡ .take <packname> → Nom personnalisé\n│ ⬡ .take <pack> | <auteur>\n└──────────────────────\n\n📌 *Exemples :*\n┌──────────────────────\n│ .take MonPack\n│ .take MonPack | IBSACKO\n└──────────────────────\n\n> _Propulsé par 🥷 IBSACKO™_`,
            contextInfo: channelInfo
        }, { quoted: message });
    }

    // Parsing packname et auteur
    const input = args.join(' ');
    const parts = input.split('|');
    const packname = parts[0]?.trim() || settings.packname || 'ITACHI-XMD';
    const author = parts[1]?.trim() || settings.author || 'IBSACKO™';

    try {
        await sock.sendMessage(chatId, { text: `⏳ _Modification du sticker en cours..._` }, { quoted: message });

        // Télécharger le sticker
        const stream = await downloadContentFromMessage(replyMsg.stickerMessage, 'sticker');
        let buf = Buffer.from([]);
        for await (const chunk of stream) buf = Buffer.concat([buf, chunk]);

        // Modifier les métadonnées EXIF
        const img = new webp.Image();
        await img.load(buf);

        const json = {
            'sticker-pack-id': crypto.randomBytes(32).toString('hex'),
            'sticker-pack-name': packname,
            'sticker-pack-publisher': author,
            'emojis': ['🥷']
        };

        const exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00,
            0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]);
        const jsonBuf = Buffer.from(JSON.stringify(json), 'utf8');
        const exif = Buffer.concat([exifAttr, jsonBuf]);
        exif.writeUIntLE(jsonBuf.length, 14, 4);

        img.exif = exif;
        const finalBuf = await img.save(null);

        await sock.sendMessage(chatId, {
            sticker: finalBuf,
            contextInfo: channelInfo
        }, { quoted: message });

        await sock.sendMessage(chatId, {
            text: `╔═══════════════════════╗\n║  🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗 v2.0* 🥷  ║\n╠═══════════════════════╣\n║   🧩 *STICKER MODIFIÉ*    ║\n╚═══════════════════════╝\n\n✅ *Sticker mis à jour !*\n\n┌──────────────────────\n│ 📦 *Pack :* ${packname}\n│ ✍️ *Auteur :* ${author}\n└──────────────────────\n\n> _Propulsé par 🥷 IBSACKO™_`,
            contextInfo: channelInfo
        }, { quoted: message });

    } catch (e) {
        console.error('❌ [take]', e.message);
        await sock.sendMessage(chatId, {
            text: `❌ *Erreur lors de la modification du sticker.*\n_Assurez-vous de répondre à un sticker valide._`,
            contextInfo: channelInfo
        }, { quoted: message });
    }
}

module.exports = takeCommand;
