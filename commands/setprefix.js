const fs = require('fs');
const path = require('path');

const PREFIX_FILE = path.join(__dirname, '../data/prefix.json');

const channelInfo = {
    forwardingScore: 1, isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363408304719268@newsletter',
        newsletterName: 'ITACHI-XMD', serverMessageId: -1
    }
};

const VALID_PREFIXES = ['.', '!', '/', '?', '%', '*', 'Ib', 'Bot', '⚡', '🥷', '🚀', '🤖'];

function getCurrentPrefix() {
    try { return JSON.parse(fs.readFileSync(PREFIX_FILE)).prefix || '.'; }
    catch { return '.'; }
}

function savePrefix(p) {
    fs.writeFileSync(PREFIX_FILE, JSON.stringify({ prefix: p }, null, 2));
    if (global.settings) global.settings.prefix = p;
}

async function setprefixCommand(sock, chatId, args, message) {
    const current = getCurrentPrefix();

    if (!args || args.length === 0) {
        const prefixRows = VALID_PREFIXES.map((p, i) => {
            const active = p === current ? ' ✅' : '';
            return `│ ${String(i+1).padStart(2)}. \`${p}\`${active}`;
        }).join('\n');

        return await sock.sendMessage(chatId, {
            image: { url: 'https://i.ibb.co/ds0fdYCX/IMG-20260409-WA0249.jpg' },
            caption: `╔══════════════════════╗\n║   🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗-𝐕2* 🥷   ║\n╠══════════════════════╣\n║   ⚙️ *GESTION DU PRÉFIXE*  ║\n╚══════════════════════╝\n\n📌 *Préfixe actuel :* \`${current}\`\n\n🔢 *Préfixes disponibles :*\n┌──────────────────────\n${prefixRows}\n└──────────────────────\n\n💡 *Comment changer :*\n┌──────────────────────\n│ \`${current}setprefix .\`  → Point\n│ \`${current}setprefix !\`  → Exclamation\n│ \`${current}setprefix /\`  → Slash\n│ \`${current}setprefix ⚡\` → Éclair\n│ \`${current}setprefix 🥷\` → Ninja\n└──────────────────────\n\n> _Propulsé par 🥷 *IBSACKO™*_`,
            contextInfo: channelInfo
        }, { quoted: message });
    }

    const newPrefix = args.join(' ').trim();

    if (!VALID_PREFIXES.includes(newPrefix)) {
        return await sock.sendMessage(chatId, {
            text: `╔══════════════════════╗\n║   🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗-𝐕2* 🥷   ║\n╚══════════════════════╝\n\n❌ *Préfixe invalide :* \`${newPrefix}\`\n\n📋 *Préfixes valides :*\n${VALID_PREFIXES.map(p => `\`${p}\``).join('  ')}\n\n> _Propulsé par 🥷 *IBSACKO™*_`,
            contextInfo: channelInfo
        }, { quoted: message });
    }

    if (newPrefix === current) {
        return await sock.sendMessage(chatId, {
            text: `ℹ️ Le préfixe est déjà \`${current}\` !`,
            contextInfo: channelInfo
        }, { quoted: message });
    }

    savePrefix(newPrefix);

    await sock.sendMessage(chatId, {
        image: { url: 'https://i.ibb.co/ds0fdYCX/IMG-20260409-WA0249.jpg' },
        caption: `╔══════════════════════╗\n║   🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗-𝐕2* 🥷   ║\n╠══════════════════════╣\n║   ✅ *PRÉFIXE CHANGÉ !*    ║\n╚══════════════════════╝\n\n🔄 *Ancien préfixe :* \`${current}\`\n🆕 *Nouveau préfixe :* \`${newPrefix}\`\n\n📋 *Exemples avec le nouveau préfixe :*\n┌──────────────────────\n│ ⬡ \`${newPrefix}menu\` → Menu principal\n│ ⬡ \`${newPrefix}help\` → Aide\n│ ⬡ \`${newPrefix}ping\` → Tester le bot\n│ ⬡ \`${newPrefix}alive\` → État du bot\n│ ⬡ \`${newPrefix}ai <question>\` → IA\n└──────────────────────\n\n✅ _Le bot répond maintenant avec \`${newPrefix}\`_\n\n> _Propulsé par 🥷 *IBSACKO™*_`,
        contextInfo: channelInfo
    }, { quoted: message });
}

module.exports = { setprefixCommand, getCurrentPrefix, VALID_PREFIXES };
