const settings = require('../settings');

const channelInfo = {
    forwardingScore: 1, isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363408304719268@newsletter',
        newsletterName: 'ITACHI-XMD', serverMessageId: -1
    }
};

const BOT_IMAGE = 'https://i.ibb.co/zTpCpsDD/54c381553462489288313ec73a0bbfe8.jpg';

function formatUptime(s) {
    const d = Math.floor(s / 86400);
    const h = Math.floor((s % 86400) / 3600);
    const m = Math.floor((s % 3600) / 60);
    return `${d > 0 ? d + 'j ' : ''}${h}h ${m}m`;
}

async function aliveCommand(sock, chatId, message) {
    try {
        const uptime = formatUptime(Math.floor(process.uptime()));
        const ram = (process.memoryUsage().rss / 1024 / 1024).toFixed(1);

        const caption = `┏━━━━━━━━━━━━━━━━━━━━━━┓
┃  🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗 v2.0* 🥷  ┃
┗━━━━━━━━━━━━━━━━━━━━━━┛

💚 *OUI JE SUIS VIVANT !*
━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────
│ ✅ *Statut   :* En ligne
│ ⏱️ *Uptime   :* ${uptime}
│ 📦 *Version  :* v${settings.version}
│ 🌍 *Mode     :* ${settings.commandMode || 'Public'}
│ 👤 *Owner    :* ${settings.botOwner}
│ 💾 *RAM      :* ${ram} MB
└─────────────────────

━━━━━━━━━━━━━━━━━━━━━━
🛡️ *Fonctions actives :*
┌─────────────────────
│ ⬡ Gestion de groupe
│ ⬡ Protection antilink
│ ⬡ IA & Jeux
│ ⬡ Téléchargements
│ ⬡ +33 nouvelles cmds v2.0
└─────────────────────

━━━━━━━━━━━━━━━━━━━━━━
💡 Tape *${settings.prefix}menu* pour tout voir !

> _Propulsé par 🥷 *IBSACKO™*_`;

        await sock.sendMessage(chatId, {
            image: { url: BOT_IMAGE },
            caption,
            contextInfo: channelInfo
        }, { quoted: message });

    } catch (e) {
        console.error('❌ [alive]', e.message);
        await sock.sendMessage(chatId, {
            text: `✅ *ITACHI-XMD v${settings.version}* est en ligne !\n💡 Tape *${settings.prefix}menu* pour les commandes.`,
            contextInfo: channelInfo
        }, { quoted: message });
    }
}

module.exports = aliveCommand;
