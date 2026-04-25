// Pair → Connecte le bot à WhatsApp via un code de liaison
const axios = require('axios');
const { sleep } = require('../lib/myfunc');

const channelInfo = {
    forwardingScore: 1, isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363408304719268@newsletter',
        newsletterName: 'ITACHI-XMD', serverMessageId: -1
    }
};

async function pairCommand(sock, chatId, message, args) {
    const number = args[0]?.replace(/[^0-9]/g, '');

    if (!number || number.length < 7) {
        return await sock.sendMessage(chatId, {
            image: { url: 'https://i.ibb.co/zTpCpsDD/54c381553462489288313ec73a0bbfe8.jpg' },
            caption: `╔═══════════════════════╗\n║  🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗 v2.0* 🥷  ║\n╠═══════════════════════╣\n║   📲 *CONNEXION BOT*      ║\n╚═══════════════════════╝\n\n🔑 *Pairing Code WhatsApp*\n\nPermet de connecter le bot à ton numéro WhatsApp sans scanner de QR code.\n\n💡 *Usage :*\n┌──────────────────────\n│ .pair <ton numéro>\n│ _Exemple : .pair 224621963059_\n└──────────────────────\n\n📌 *Étapes :*\n┌──────────────────────\n│ 1️⃣ Tape .pair <numéro>\n│ 2️⃣ Reçois ton code\n│ 3️⃣ WhatsApp → Appareils liés\n│ 4️⃣ Entrer le code\n│ ✅ Bot connecté !\n└──────────────────────\n\n> _Propulsé par 🥷 IBSACKO™_`,
            contextInfo: channelInfo
        }, { quoted: message });
    }

    try {
        await sock.sendMessage(chatId, {
            text: `╔═══════════════════════╗\n║  🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗 v2.0* 🥷  ║\n╚═══════════════════════╝\n\n⏳ *Génération du code de liaison...*\n📞 *Numéro :* +${number}\n\n_Patiente quelques secondes..._`,
            contextInfo: channelInfo
        }, { quoted: message });

        // Vérifie si le numéro est sur WhatsApp
        const whatsappID = number + '@s.whatsapp.net';
        const check = await sock.onWhatsApp(whatsappID);

        if (!check || !check[0]?.exists) {
            return await sock.sendMessage(chatId, {
                text: `╔═══════════════════════╗\n║  🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗 v2.0* 🥷  ║\n╚═══════════════════════╝\n\n❌ *Ce numéro n'est pas enregistré sur WhatsApp !*\n📞 *Numéro vérifié :* +${number}\n\n> _Vérifiez le numéro et réessayez._`,
                contextInfo: channelInfo
            }, { quoted: message });
        }

        // Génère le code de liaison
        const code = await sock.requestPairingCode(whatsappID);
        const formattedCode = code?.match(/.{1,4}/g)?.join('-') || code;

        await sleep(2000);

        await sock.sendMessage(chatId, {
            image: { url: 'https://i.ibb.co/hRLmqqL3/db1a6a35f63a2a65d94987e71b6caa89.jpg' },
            caption: `╔═══════════════════════╗\n║  🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗 v2.0* 🥷  ║\n╠═══════════════════════╣\n║   📲 *CODE DE LIAISON*    ║\n╚═══════════════════════╝\n\n📞 *Numéro :* +${number}\n\n🔑 *Ton code :*\n┌──────────────────────\n│ \`\`\`${formattedCode}\`\`\`\n└──────────────────────\n\n📌 *Comment l'utiliser :*\n┌──────────────────────\n│ 1️⃣ Ouvre WhatsApp\n│ 2️⃣ Paramètres → Appareils liés\n│ 3️⃣ Lier un appareil\n│ 4️⃣ Saisir le code manuellement\n│ 5️⃣ Entre : ${formattedCode}\n│ ✅ Bot connecté !\n└──────────────────────\n\n⏰ *Ce code expire dans 60 secondes !*\n\n> _Propulsé par 🥷 IBSACKO™_`,
            contextInfo: channelInfo
        }, { quoted: message });

    } catch (e) {
        console.error('❌ [pair]', e.message);
        await sock.sendMessage(chatId, {
            text: `╔═══════════════════════╗\n║  🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗 v2.0* 🥷  ║\n╚═══════════════════════╝\n\n❌ *Impossible de générer le code.*\n\n_Vérifiez que :_\n┌──────────────────────\n│ ✅ Le numéro est correct\n│ ✅ Le bot n'est pas déjà connecté\n│ ✅ La session est valide\n└──────────────────────\n\n_Erreur : ${e.message}_`,
            contextInfo: channelInfo
        }, { quoted: message });
    }
}

module.exports = pairCommand;
