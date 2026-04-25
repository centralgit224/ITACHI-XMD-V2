const axios = require('axios');

const channelInfo = {
    forwardingScore: 1, isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363408304719268@newsletter',
        newsletterName: 'ITACHI-XMD', serverMessageId: -1
    }
};

async function imageCommand(sock, chatId, args, message) {
    const query = args.join(' ').trim();

    if (!query) {
        return await sock.sendMessage(chatId, {
            text: `╔═════════════════════╗\n║   🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗-𝐕2* 🥷   ║\n╚═════════════════════╝\n\n🖼️ *Usage :* .image <mot-clé>\n💡 _Exemple : .image CR7_`,
            contextInfo: channelInfo
        }, { quoted: message });
    }

    await sock.sendMessage(chatId, { react: { text: '🔍', key: message.key } });

    const q = encodeURIComponent(query);

    // Essayer les sources dans l'ordre
    const sources = [
        // 1. GiftedTech image search
        async () => {
            const r = await axios.get(`https://api.giftedtech.my.id/api/search/imgsearch?apikey=gifted&q=${q}`, { timeout: 15000 });
            const arr = r.data?.result || r.data?.data || [];
            if (Array.isArray(arr) && arr.length > 0) {
                return arr.slice(0, 3).map(i => i.url || i.link || (typeof i === 'string' ? i : null)).filter(Boolean);
            }
            return null;
        },
        // 2. Siputzx Pinterest
        async () => {
            const r = await axios.get(`https://api.siputzx.my.id/api/search/pinterest?q=${q}`, { timeout: 15000 });
            const arr = r.data?.data || r.data?.result || [];
            if (Array.isArray(arr) && arr.length > 0) {
                return arr.slice(0, 3).map(i => i.url || i.src || i.link || (typeof i === 'string' ? i : null)).filter(Boolean);
            }
            return null;
        },
        // 3. Ryzendesu image
        async () => {
            const r = await axios.get(`https://api.ryzendesu.vip/api/search/pinterest?query=${q}`, { timeout: 15000 });
            const arr = r.data?.data || r.data?.result || [];
            if (Array.isArray(arr) && arr.length > 0) {
                return arr.slice(0, 3).map(i => i.url || i.src || (typeof i === 'string' ? i : null)).filter(Boolean);
            }
            return null;
        },
        // 4. Lexica (images IA)
        async () => {
            const r = await axios.get(`https://lexica.art/api/v1/search?q=${q}`, { timeout: 15000 });
            const arr = r.data?.images || [];
            if (arr.length > 0) return arr.slice(0, 3).map(i => i.src).filter(Boolean);
            return null;
        },
        // 5. Unsplash (toujours disponible — fallback absolu)
        async () => {
            return [
                `https://source.unsplash.com/800x600/?${q}&sig=1`,
                `https://source.unsplash.com/800x600/?${q}&sig=2`,
            ];
        }
    ];

    let images = null;
    for (const source of sources) {
        try {
            const result = await source();
            if (result && result.length > 0) {
                images = result.filter(u => u && typeof u === 'string' && u.startsWith('http'));
                if (images.length > 0) break;
            }
        } catch { continue; }
    }

    if (!images || images.length === 0) {
        images = [`https://source.unsplash.com/800x600/?${q}`];
    }

    let sent = 0;
    for (let i = 0; i < images.length; i++) {
        try {
            await new Promise(r => setTimeout(r, 500));
            await sock.sendMessage(chatId, {
                image: { url: images[i] },
                caption: `╔═════════════════════╗\n║   🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗-𝐕2* 🥷   ║\n╚═════════════════════╝\n\n🖼️ *${query}* — Image ${i + 1}/${images.length}\n> _Propulsé par 🥷 *IBSACKO™*_`,
                contextInfo: channelInfo
            }, { quoted: i === 0 ? message : undefined });
            sent++;
        } catch { continue; }
    }

    if (sent === 0) {
        await sock.sendMessage(chatId, {
            text: `❌ *Aucune image trouvée pour :* "${query}"\n💡 _Essaie un autre mot-clé._`,
            contextInfo: channelInfo
        }, { quoted: message });
    }
}

module.exports = imageCommand;
