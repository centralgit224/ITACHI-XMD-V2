const { setAntilink, getAntilink, removeAntilink } = require('../lib/index');

const channelInfo = {
    forwardingScore: 1, isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363408304719268@newsletter',
        newsletterName: 'ITACHI-XMD', serverMessageId: -1
    }
};

async function handleAntilinkCommand(sock, chatId, userMessage, senderId, isSenderAdmin, message) {
    try {
        const prefix = '.';
        const args = userMessage.slice(9).toLowerCase().trim().split(' ');
        const action = args[0];

        if (!action) {
            const existing = await getAntilink(chatId, 'on');
            const current = existing?.enabled ? '🟢 Activé' : '🔴 Désactivé';
            return await sock.sendMessage(chatId, {
                image: { url: 'https://i.ibb.co/ds0fdYCX/IMG-20260409-WA0249.jpg' },
                caption: `╔═════════════════════╗\n║   🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗-𝐕2* 🥷   ║\n╠═════════════════════╣\n║   🔗 *ANTI-LIEN*           ║\n╚═════════════════════╝\n\n📊 *Statut :* ${current}\n\n📌 *Commandes :*\n┌─────────────────────\n│ ⬡ ${prefix}antilink on\n│ ⬡ ${prefix}antilink off\n│ ⬡ ${prefix}antilink set delete\n│ ⬡ ${prefix}antilink set kick\n│ ⬡ ${prefix}antilink set warn\n└─────────────────────\n\n> _Propulsé par 🥷 *IBSACKO™*_`,
                contextInfo: channelInfo
            }, { quoted: message });
        }

        switch (action) {
            case 'on': {
                const existing = await getAntilink(chatId, 'on');
                if (existing?.enabled) {
                    return await sock.sendMessage(chatId, { text: `╔═════════════════════╗\n║   🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗-𝐕2* 🥷   ║\n╚═════════════════════╝\n\n⚠️ *Anti-Lien est déjà activé !*`, contextInfo: channelInfo }, { quoted: message });
                }
                await setAntilink(chatId, 'on', 'delete');
                return await sock.sendMessage(chatId, { text: `╔═════════════════════╗\n║   🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗-𝐕2* 🥷   ║\n╚═════════════════════╝\n\n🔗 *Anti-Lien :* 🟢 Activé\n\n> _Tous les liens seront supprimés._`, contextInfo: channelInfo }, { quoted: message });
            }
            case 'off': {
                await removeAntilink(chatId, 'on');
                return await sock.sendMessage(chatId, { text: `╔═════════════════════╗\n║   🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗-𝐕2* 🥷   ║\n╚═════════════════════╝\n\n🔗 *Anti-Lien :* 🔴 Désactivé`, contextInfo: channelInfo }, { quoted: message });
            }
            case 'set': {
                const setAction = args[1];
                if (!['delete', 'kick', 'warn'].includes(setAction)) {
                    return await sock.sendMessage(chatId, { text: `❌ *Action invalide !*\nChoisissez : delete | kick | warn`, contextInfo: channelInfo }, { quoted: message });
                }
                await setAntilink(chatId, 'on', setAction);
                return await sock.sendMessage(chatId, { text: `✅ *Action anti-lien :* ${setAction}`, contextInfo: channelInfo }, { quoted: message });
            }
            default:
                return await sock.sendMessage(chatId, { text: `❌ *Commande inconnue.*\nUsage : .antilink on | off | set delete/kick/warn`, contextInfo: channelInfo }, { quoted: message });
        }
    } catch (e) {
        console.error('❌ [antilink]', e.message);
        await sock.sendMessage(chatId, { text: `❌ *Erreur :* ${e.message}`, contextInfo: channelInfo }, { quoted: message });
    }
}

module.exports = { handleAntilinkCommand };
