const fs = require('fs');
const path = require('path');
const isOwnerOrSudo = require('../lib/isOwner');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const axios = require('axios');

const imgPath = path.join(__dirname, '../data/menuimage.json');
const channelInfo = {
    forwardingScore: 1, isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363408304719268@newsletter',
        newsletterName: 'ITACHI-XMD', serverMessageId: -1
    }
};

if (!fs.existsSync(imgPath)) fs.writeFileSync(imgPath, JSON.stringify({ url: 'https://i.ibb.co/zTpCpsDD/54c381553462489288313ec73a0bbfe8.jpg' }));

async function setmenuimageCommand(sock, chatId, senderId, args, replyMessage, message) {
    // Via URL en argument
    if (args[0] && args[0].startsWith('http')) {
        fs.writeFileSync(imgPath, JSON.stringify({ url: args[0] }));
        return await sock.sendMessage(chatId, {
            image: { url: args[0] },
            caption: `╔══════════════════════╗\n║   🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗* 🥷   ║\n╠══════════════════════╣\n║  🖼️ *IMAGE MENU MÀJ*   ║\n╚══════════════════════╝\n\n✅ *Image du menu mise à jour !*\n\n> _Propulsé par 🥷 IBSACKO™_`,
            contextInfo: channelInfo
        }, { quoted: message });
    }

    // Via image en réponse
    if (replyMessage?.imageMessage) {
        try {
            const stream = await downloadContentFromMessage(replyMessage.imageMessage, 'image');
            let buf = Buffer.from([]);
            for await (const chunk of stream) buf = Buffer.concat([buf, chunk]);

            // Upload image sur uguu.se
            const FormData = require('form-data');
            const form = new FormData();
            form.append('files[]', buf, { filename: 'menu.jpg', contentType: 'image/jpeg' });
            const res = await axios.post('https://uguu.se/upload.php', form, { headers: form.getHeaders() });
            const uploadedUrl = res.data?.files?.[0]?.url;

            if (uploadedUrl) {
                fs.writeFileSync(imgPath, JSON.stringify({ url: uploadedUrl }));
                return await sock.sendMessage(chatId, {
                    image: { url: uploadedUrl },
                    caption: `╔══════════════════════╗\n║   🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗* 🥷   ║\n╠══════════════════════╣\n║  🖼️ *IMAGE MENU MÀJ*   ║\n╚══════════════════════╝\n\n✅ *Image du menu mise à jour !*\n🔗 ${uploadedUrl}\n\n> _Propulsé par 🥷 IBSACKO™_`,
                    contextInfo: channelInfo
                }, { quoted: message });
            }
        } catch (e) {
            console.error('❌ [setmenuimage]', e.message);
        }
    }

    // Usage
    return await sock.sendMessage(chatId, {
        text: `╔══════════════════════╗\n║   🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗* 🥷   ║\n╠══════════════════════╣\n║  🖼️ *IMAGE DU MENU*    ║\n╚══════════════════════╝\n\n💡 *Méthodes :*\n┌──────────────────────\n│ 1️⃣ Réponds à une image avec *.setmenuimage*\n│ 2️⃣ *.setmenuimage <url>*\n└──────────────────────\n\n> _Propulsé par 🥷 IBSACKO™_`,
        contextInfo: channelInfo
    }, { quoted: message });
}

module.exports = setmenuimageCommand;
