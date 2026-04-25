const os = require('os');
const settings = require('../settings.js');

const channelInfo = {
    forwardingScore: 1, isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363408304719268@newsletter',
        newsletterName: 'ITACHI-XMD', serverMessageId: -1
    }
};

// Image stable ibb.co
const BOT_IMAGE = 'https://i.ibb.co/zTpCpsDD/54c381553462489288313ec73a0bbfe8.jpg';

function formatUptime(s) {
    const d = Math.floor(s / 86400);
    const h = Math.floor((s % 86400) / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sc = Math.floor(s % 60);
    return `${d > 0 ? d + 'j ' : ''}${h}h ${m}m ${sc}s`;
}

function bar(pct, len = 10) {
    const f = Math.min(len, Math.round((pct / 100) * len));
    return '▓'.repeat(f) + '░'.repeat(len - f);
}

function pingColor(ms) {
    if (ms < 100) return '🟢';
    if (ms < 300) return '🟡';
    return '🔴';
}

async function pingCommand(sock, chatId, message) {
    try {
        const start = Date.now();
        await sock.sendMessage(chatId, { react: { text: '⏱️', key: message.key } });
        const ping = Date.now() - start;

        const uptime   = formatUptime(Math.floor(process.uptime()));
        const ramUsed  = (process.memoryUsage().rss / 1024 / 1024).toFixed(1);
        const ramTotal = (os.totalmem() / 1024 / 1024).toFixed(0);
        const ramPct   = ((process.memoryUsage().rss / os.totalmem()) * 100).toFixed(0);
        const cpu      = os.loadavg()[0].toFixed(2);
        const cpuPct   = Math.min(100, Math.round(os.loadavg()[0] * 25));

        const caption = `┏━━━━━━━━━━━━━━━━━━━━━━┓
┃  🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗 v2.0* 🥷  ┃
┗━━━━━━━━━━━━━━━━━━━━━━┛

📡 *STATUT DU BOT*
━━━━━━━━━━━━━━━━━━━━━━

${pingColor(ping)} *Ping     :* \`${ping} ms\`
⏱️ *Uptime   :* \`${uptime}\`
📦 *Version  :* \`v${settings.version}\`
🌐 *Node.js  :* \`${process.version}\`

━━━━━━━━━━━━━━━━━━━━━━
💾 *RAM* — ${ramUsed}/${ramTotal} MB
\`[${bar(parseInt(ramPct))}]\` *${ramPct}%*

🖥️ *CPU Load* — ${cpu}
\`[${bar(cpuPct)}]\` *~${cpuPct}%*

━━━━━━━━━━━━━━━━━━━━━━
┌─────────────────────
│ ✅ Statut  : *En ligne*
│ 🌍 Mode    : *${settings.commandMode || 'Public'}*
│ 🔑 Préfixe : *${settings.prefix}*
│ 🖥️ OS      : *${os.platform()}*
└─────────────────────

> _Propulsé par 🥷 *IBSACKO™*_`;

        await sock.sendMessage(chatId, {
            image: { url: BOT_IMAGE },
            caption,
            contextInfo: channelInfo
        }, { quoted: message });

    } catch (e) {
        console.error('❌ [ping]', e.message);
        await sock.sendMessage(chatId, {
            text: `🥷 *ITACHI-XMD v${settings.version}* — En ligne !\n⏱️ Uptime : ${Math.floor(process.uptime())}s`,
            contextInfo: channelInfo
        }, { quoted: message });
    }
}

module.exports = pingCommand;
