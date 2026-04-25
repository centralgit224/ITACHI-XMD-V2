// Uptime → Affiche le temps d'activité du bot avec stats système
const os = require('os');
const settings = require('../settings');

const channelInfo = {
    forwardingScore: 1, isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363408304719268@newsletter',
        newsletterName: 'ITACHI-XMD', serverMessageId: -1
    }
};

function formatUptime(sec) {
    const d = Math.floor(sec / 86400);
    const h = Math.floor((sec % 86400) / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = Math.floor(sec % 60);
    const parts = [];
    if (d) parts.push(`${d} jour${d > 1 ? 's' : ''}`);
    if (h) parts.push(`${h}h`);
    if (m) parts.push(`${m}m`);
    parts.push(`${s}s`);
    return parts.join(' ');
}

function getBar(pct, len = 14) {
    const f = Math.round((Math.min(100, pct) / 100) * len);
    return '█'.repeat(f) + '░'.repeat(len - f);
}

async function uptimeCommand(sock, chatId, message) {
    const uptime = Math.floor(process.uptime());
    const mem = process.memoryUsage();
    const ramUsedMB = (mem.rss / 1024 / 1024).toFixed(1);
    const ramTotalMB = (os.totalmem() / 1024 / 1024).toFixed(0);
    const ramPct = ((mem.rss / os.totalmem()) * 100).toFixed(1);
    const heapUsed = (mem.heapUsed / 1024 / 1024).toFixed(1);
    const heapTotal = (mem.heapTotal / 1024 / 1024).toFixed(1);
    const cpu = os.loadavg()[0].toFixed(2);
    const cpuPct = Math.min(100, Math.round(os.loadavg()[0] * 25));
    const platform = os.platform();
    const arch = os.arch();
    const nodeVer = process.version;

    await sock.sendMessage(chatId, {
        image: { url: 'https://i.ibb.co/zTpCpsDD/54c381553462489288313ec73a0bbfe8.jpg' },
        caption: `╔═══════════════════════╗\n║  🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗 v2.0* 🥷  ║\n╠═══════════════════════╣\n║    ⏱️ *UPTIME DU BOT*     ║\n╚═══════════════════════╝\n\n⏱️ *Temps en ligne :*\n┌──────────────────────\n│ 🕐 ${formatUptime(uptime)}\n└──────────────────────\n\n💾 *Mémoire RAM :*\n┌──────────────────────\n│ Utilisée : ${ramUsedMB} MB / ${ramTotalMB} MB\n│ \`[${getBar(parseFloat(ramPct))}]\` ${ramPct}%\n│ Heap : ${heapUsed} / ${heapTotal} MB\n└──────────────────────\n\n🖥️ *CPU :*\n┌──────────────────────\n│ Load : ${cpu}\n│ \`[${getBar(cpuPct)}]\` ~${cpuPct}%\n└──────────────────────\n\n🔧 *Système :*\n┌──────────────────────\n│ 📦 Version : v${settings.version}\n│ 🟢 Node.js : ${nodeVer}\n│ 💻 OS : ${platform} (${arch})\n│ 🧵 CPUs : ${os.cpus().length} cœurs\n└──────────────────────\n\n> _Propulsé par 🥷 IBSACKO™_`,
        contextInfo: channelInfo
    }, { quoted: message });
}

module.exports = uptimeCommand;
