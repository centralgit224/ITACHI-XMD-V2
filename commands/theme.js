const fs = require('fs');
const path = require('path');

const channelInfo = {
    forwardingScore: 1, isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363408304719268@newsletter',
        newsletterName: 'ITACHI-XMD', serverMessageId: -1
    }
};

const themes = [
    { num: 1, url: 'https://i.ibb.co/d4Nx7QQF/IMG-20260408-WA0358.jpg',   label: '🌑 Thème 1' },
    { num: 2, url: 'https://i.ibb.co/m5XQR7ss/IMG-20260408-WA0353.jpg',   label: '🔵 Thème 2' },
    { num: 3, url: 'https://i.ibb.co/hx46KTS8/IMG-20260408-WA0350.jpg',   label: '🟣 Thème 3' },
    { num: 4, url: 'https://i.ibb.co/zHtxkpj3/IMG-20260408-WA0356.jpg',   label: '🔴 Thème 4' },
    { num: 5, url: 'https://i.ibb.co/3y2rrKtC/IMG-20260408-WA0351.jpg',   label: '🟠 Thème 5' },
    { num: 6, url: 'https://i.ibb.co/DP0W7h4h/IMG-20260408-WA0352.jpg',   label: '🟢 Thème 6' },
    { num: 7, url: 'https://i.ibb.co/6RFrsGWX/IMG-20260408-WA0355-1.jpg', label: '🌌 Thème 7' },
    { num: 8, url: 'https://i.ibb.co/ds0fdYCX/IMG-20260409-WA0249.jpg',   label: '⚡ Thème 8' },
];

const menuImagePath = path.join(__dirname, '../data/menuimage.json');

function setMenuImage(url) {
    try {
        fs.writeFileSync(menuImagePath, JSON.stringify({ url }, null, 2));
        return true;
    } catch { return false; }
}

async function themeCommand(sock, chatId, args, message) {
    const num = parseInt(args[0]);

    // Sans argument → afficher la liste
    if (!num || isNaN(num)) {
        let list = `╔═════════════════════╗\n║   🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗-𝐕2* 🥷   ║\n╠═════════════════════╣\n║     🎨 *GALERIE THÈMES*    ║\n╚═════════════════════╝\n\n`;

        themes.forEach(t => {
            list += `🥷────────────────🥷\n│ 🖼️ *Img ${t.num}* — ${t.label}\n╰────────────────🥷\n`;
        });

        list += `\n💡 *Usage :* \`.theme <1-8>\`\n_Exemple : .theme 3_\n\n⚠️ *Le thème choisi deviendra l'image du menu !*\n\n> _Propulsé par 🥷 *IBSACKO™*_`;

        return await sock.sendMessage(chatId, {
            image: { url: themes[0].url },
            caption: list,
            contextInfo: channelInfo
        }, { quoted: message });
    }

    if (num < 1 || num > 8) {
        return await sock.sendMessage(chatId, {
            text: `❌ *Numéro invalide !*\nChoisissez entre *1* et *8*.\n💡 Tape *.theme* pour voir la liste.`,
            contextInfo: channelInfo
        }, { quoted: message });
    }

    const selected = themes[num - 1];

    // ✅ Mettre à jour l'image du menu avec ce thème
    setMenuImage(selected.url);

    // Envoyer les 8 images dans l'ordre
    await sock.sendMessage(chatId, {
        text: `🎨 *Chargement des 8 thèmes...*`,
        contextInfo: channelInfo
    }, { quoted: message });

    for (const t of themes) {
        await new Promise(r => setTimeout(r, 600));
        await sock.sendMessage(chatId, {
            image: { url: t.url },
            caption: `╔═════════════════════╗\n║   🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗-𝐕2* 🥷   ║\n╠═════════════════════╣\n║      🎨 *GALERIE THÈMES*   ║\n╚═════════════════════╝\n\n🖼️ *Img ${t.num}* / 8 — ${t.label}${t.num === num ? '\n\n✅ *← Thème sélectionné !*' : ''}`,
            contextInfo: channelInfo
        });
    }

    // Confirmation finale
    await sock.sendMessage(chatId, {
        text: `╔═════════════════════╗\n║   🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗-𝐕2* 🥷   ║\n╠═════════════════════╣\n║   ✅ *THÈME APPLIQUÉ*      ║\n╚═════════════════════╝\n\n🎨 *${selected.label}* activé !\n🖼️ *Img ${selected.num}* / 8\n\n✅ *Cette image est maintenant l'image du menu !*\n💡 Tape *.menu* pour vérifier.\n\n> _Propulsé par 🥷 *IBSACKO™*_`,
        contextInfo: channelInfo
    }, { quoted: message });
}

module.exports = themeCommand;
