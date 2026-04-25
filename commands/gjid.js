// Gjid → Donne l'identifiant JID du groupe
const channelInfo = {
    forwardingScore: 1, isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363408304719268@newsletter',
        newsletterName: 'ITACHI-XMD', serverMessageId: -1
    }
};

async function gjidCommand(sock, chatId, message) {
    if (!chatId.endsWith('@g.us')) {
        return await sock.sendMessage(chatId, {
            text: `╔══════════════════════╗\n║   🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗* 🥷   ║\n╚══════════════════════╝\n\n❌ *Uniquement dans les groupes !*`,
            contextInfo: channelInfo
        }, { quoted: message });
    }

    try {
        const meta = await sock.groupMetadata(chatId);
        const created = meta.creation ? new Date(meta.creation * 1000).toLocaleDateString('fr-FR') : 'Inconnu';

        await sock.sendMessage(chatId, {
            image: { url: 'https://i.ibb.co/zTpCpsDD/54c381553462489288313ec73a0bbfe8.jpg' },
            caption: `╔═══════════════════════╗\n║  🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗 v2.0* 🥷  ║\n╠═══════════════════════╣\n║   🆔 *JID DU GROUPE*      ║\n╚═══════════════════════╝\n\n👥 *Groupe :* ${meta.subject}\n📅 *Créé le :* ${created}\n👤 *Membres :* ${meta.participants.length}\n\n🆔 *Identifiant (JID) :*\n┌──────────────────────\n│ \`\`\`${chatId}\`\`\`\n└──────────────────────\n\n> _Copie le JID ci-dessus_\n> _Propulsé par 🥷 IBSACKO™_`,
            contextInfo: channelInfo
        }, { quoted: message });
    } catch (e) {
        console.error('❌ [gjid]', e.message);
        await sock.sendMessage(chatId, {
            text: `🆔 *JID du groupe :*\n\`\`\`${chatId}\`\`\``,
            contextInfo: channelInfo
        }, { quoted: message });
    }
}

module.exports = gjidCommand;
