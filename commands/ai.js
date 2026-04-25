const axios = require('axios');

const channelInfo = {
    forwardingScore: 1, isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363408304719268@newsletter',
        newsletterName: 'ITACHI-XMD', serverMessageId: -1
    }
};

function getPrompt() {
    try {
        const fs = require('fs'), path = require('path');
        const p = path.join(__dirname, '../data/prompt.json');
        return JSON.parse(fs.readFileSync(p)).prompt || "Tu es ITACHI-XMD, assistant WhatsApp créé par IBSACKO. Réponds en français, sois utile et concis.";
    } catch {
        return "Tu es ITACHI-XMD, assistant WhatsApp créé par IBSACKO. Réponds en français, sois utile et concis.";
    }
}

async function aiCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text || '';
        const query = text.split(' ').slice(1).join(' ').trim();

        if (!query) {
            return await sock.sendMessage(chatId, {
                text: `╔═════════════════════╗\n║   🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗-𝐕2* 🥷   ║\n╚═════════════════════╝\n\n🤖 *Usage :* .ai <question>\n💡 _Exemple : .ai C'est quoi Python ?_`,
                contextInfo: channelInfo
            }, { quoted: message });
        }

        await sock.sendMessage(chatId, { react: { text: '🤖', key: message.key } });

        const systemPrompt = getPrompt();
        const q = encodeURIComponent(query);
        const sq = encodeURIComponent(`${systemPrompt}\n\n${query}`);

        // APIs avec axios (plus fiable que node-fetch)
        const apis = [
            // Pollinations — gratuit sans clé
            () => axios.get(`https://text.pollinations.ai/${sq}`, { timeout: 20000, responseType: 'text' })
                .then(r => typeof r.data === 'string' && r.data.length > 5 ? r.data : null),

            // GiftedTech
            () => axios.get(`https://api.giftedtech.my.id/api/ai/geminiai?apikey=gifted&q=${sq}`, { timeout: 15000 })
                .then(r => r.data?.result || r.data?.answer || null),

            // Siputzx
            () => axios.get(`https://api.siputzx.my.id/api/ai/gemini-pro?content=${sq}`, { timeout: 15000 })
                .then(r => r.data?.message || r.data?.data || null),

            // Ryzendesu
            () => axios.get(`https://api.ryzendesu.vip/api/ai/gemini?text=${sq}`, { timeout: 15000 })
                .then(r => r.data?.message || r.data?.answer || null),

            // XTeam
            () => axios.get(`https://api.xteam.xyz/ai?text=${sq}&apikey=d90a9e986e18778b`, { timeout: 15000 })
                .then(r => r.data?.result || r.data?.response || null),
        ];

        let answer = null;
        for (const api of apis) {
            try {
                const result = await api();
                if (result && typeof result === 'string' && result.trim().length > 3) {
                    answer = result.trim();
                    break;
                }
            } catch (e) { continue; }
        }

        if (!answer) {
            return await sock.sendMessage(chatId, {
                text: `❌ *L'IA est temporairement indisponible.*\n_Réessayez dans quelques instants._`,
                contextInfo: channelInfo
            }, { quoted: message });
        }

        await sock.sendMessage(chatId, {
            text: `╔═════════════════════╗\n║   🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗-𝐕2* 🥷   ║\n╚═════════════════════╝\n\n❓ *Question :* ${query}\n\n💬 *Réponse :*\n${answer}\n\n> _Propulsé par 🥷 *IBSACKO™*_`,
            contextInfo: channelInfo
        }, { quoted: message });

        await sock.sendMessage(chatId, { react: { text: '✅', key: message.key } });

    } catch (e) {
        console.error('❌ [ai]', e.message);
        await sock.sendMessage(chatId, {
            text: `❌ *L'IA est temporairement indisponible.*\n_Réessaie dans quelques instants._`,
            contextInfo: channelInfo
        }, { quoted: message });
    }
}

module.exports = aiCommand;
