const axios = require('axios');

const channelInfo = {
    forwardingScore: 1, isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363408304719268@newsletter',
        newsletterName: 'ITACHI-XMD', serverMessageId: -1
    }
};

async function codeaiCommand(sock, chatId, senderId, args, message) {
    const prompt = args.join(' ').trim();

    if (!prompt) {
        return await sock.sendMessage(chatId, {
            text: `╔═════════════════════╗\n║   🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗-𝐕2* 🥷   ║\n╚═════════════════════╝\n\n💻 *Usage :* .codeai <demande>\n💡 _Exemple : .codeai crée une fonction Python qui trie une liste_`,
            contextInfo: channelInfo
        }, { quoted: message });
    }

    await sock.sendMessage(chatId, { react: { text: '💻', key: message.key } });

    const sysPrompt = "Tu es un expert développeur. Génère du code propre, commenté et fonctionnel. Réponds avec le code et une courte explication.";
    const fullPrompt = `${sysPrompt}\n\n${prompt}`;
    const q = encodeURIComponent(fullPrompt);

    const apis = [
        () => axios.get(`https://text.pollinations.ai/${q}`, { timeout: 25000, responseType: 'text' })
            .then(r => typeof r.data === 'string' && r.data.length > 10 ? r.data : null),
        () => axios.get(`https://api.giftedtech.my.id/api/ai/geminiai?apikey=gifted&q=${q}`, { timeout: 20000 })
            .then(r => r.data?.result || r.data?.answer || null),
        () => axios.get(`https://api.siputzx.my.id/api/ai/gemini-pro?content=${q}`, { timeout: 20000 })
            .then(r => r.data?.message || r.data?.data || null),
        () => axios.get(`https://api.ryzendesu.vip/api/ai/gemini?text=${q}`, { timeout: 20000 })
            .then(r => r.data?.message || r.data?.answer || null),
    ];

    let result = null;
    for (const api of apis) {
        try {
            const res = await api();
            if (res && res.trim().length > 10) { result = res.trim(); break; }
        } catch { continue; }
    }

    if (!result) {
        return await sock.sendMessage(chatId, {
            text: `❌ *L'IA Code est temporairement indisponible.*\n_Réessaie dans quelques instants._`,
            contextInfo: channelInfo
        }, { quoted: message });
    }

    const maxLen = 3500;
    const text = result.length > maxLen ? result.substring(0, maxLen) + '\n_[Tronqué]_' : result;

    await sock.sendMessage(chatId, {
        text: `╔═════════════════════╗\n║   🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗-𝐕2* 🥷   ║\n╚═════════════════════╝\n\n💻 *Code pour :* ${prompt}\n\n${text}\n\n> _Propulsé par 🥷 *IBSACKO™*_`,
        contextInfo: channelInfo
    }, { quoted: message });
    await sock.sendMessage(chatId, { react: { text: '✅', key: message.key } });
}

module.exports = codeaiCommand;
