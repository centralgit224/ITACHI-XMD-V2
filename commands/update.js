const channelInfo = {
    forwardingScore: 1, isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363408304719268@newsletter',
        newsletterName: 'ITACHI-XMD', serverMessageId: -1
    }
};

const UPDATE_IMG = 'https://i.ibb.co/nN363jyb/IMG-20260412-WA1100.jpg';

async function updateCommand(sock, chatId, message) {
    const settings = require('../settings');
    const caption = `╔═════════════════════╗
║   🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗-𝐕2* 🥷   ║
╠═════════════════════╣
║   🔄 *MISE À JOUR*         ║
╚═════════════════════╝

📦 *Version actuelle :* v${settings.version || '2.0.0'}
🆕 *Dernière version :* v2.0.0

🥷────────────────🥷
『 *NOUVEAUTÉS v2.0* 』
🥷────────────────🥷

┌─────────────────────
│ ✅ +33 nouvelles commandes
│ ✅ Anti-Mention Statut
│ ✅ Anti-Marabout
│ ✅ Système de Clans
│ ✅ Commande .loi
│ ✅ Images via Lexica + Unsplash
│ ✅ IA via Pollinations (gratuit)
│ ✅ Support chaînes WhatsApp
│ ✅ Humm silencieux → PV
│ ✅ Antilink amélioré
│ ✅ Toutes cmds libres (sans admin)
└─────────────────────

🥷────────────────🥷
『 *COMMENT METTRE À JOUR* 』
🥷────────────────🥷

┌─────────────────────
│ 1️⃣ Télécharge la dernière version
│ 2️⃣ Extrais le fichier ZIP
│ 3️⃣ Remplace les anciens fichiers
│ 4️⃣ Relance le bot
└─────────────────────

> _Propulsé par 🥷 *IBSACKO™* · CENTRAL HEX_`;

    await sock.sendMessage(chatId, {
        image: { url: UPDATE_IMG },
        caption,
        contextInfo: channelInfo
    }, { quoted: message });
}

module.exports = updateCommand;
