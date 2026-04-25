const channelInfo = {
    forwardingScore: 1, isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363408304719268@newsletter',
        newsletterName: 'ITACHI-XMD', serverMessageId: -1
    }
};

async function groupInfoCommand(sock, chatId, message) {
    if (!chatId.endsWith('@g.us')) {
        return await sock.sendMessage(chatId, { text: '❌ *Uniquement dans les groupes !*', contextInfo: channelInfo }, { quoted: message });
    }

    try {
        const meta = await sock.groupMetadata(chatId);
        const participants = meta.participants;
        const total = participants.length;
        const admins = participants.filter(p => p.admin);
        const members = total - admins.length;
        const created = meta.creation ? new Date(meta.creation * 1000).toLocaleDateString('fr-FR') : 'Inconnu';

        let adminList = '';
        admins.forEach((p, i) => {
            const role = p.admin === 'superadmin' ? '👑' : '⭐';
            adminList += `│ ${role} @${p.id.split('@')[0]}\n`;
        });

        const caption = `
┏━━━━━━━━━━━━━━━━━━━━━━┓
┃  🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗 v2.0* 🥷  ┃
┗━━━━━━━━━━━━━━━━━━━━━━┛

📊 *INFOS DU GROUPE*
━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────
│ 👥 *Nom      :* ${meta.subject}
│ 📅 *Créé le  :* ${created}
│ 🆔 *JID      :* ${chatId.split('@')[0]}
└─────────────────────

━━━━━━━━━━━━━━━━━━━━━━
📈 *Statistiques :*
┌─────────────────────
│ 👤 *Membres  :* ${members}
│ 👑 *Admins   :* ${admins.length}
│ 📊 *Total    :* ${total}
│ 🔒 *Fermé   :* ${meta.announce ? 'Oui' : 'Non'}
└─────────────────────

━━━━━━━━━━━━━━━━━━━━━━
👑 *Admins du groupe :*
┌─────────────────────
${adminList}└─────────────────────

📝 *Description :*
┌─────────────────────
│ ${meta.desc || 'Aucune description'}
└─────────────────────

> _Propulsé par 🥷 *IBSACKO™*_`.trim();

        await sock.sendMessage(chatId, {
            image: { url: 'https://i.ibb.co/zTpCpsDD/54c381553462489288313ec73a0bbfe8.jpg' },
            caption,
            mentions: admins.map(a => a.id),
            contextInfo: channelInfo
        }, { quoted: message });

    } catch (e) {
        console.error('❌ [groupinfo]', e.message);
        await sock.sendMessage(chatId, { text: '❌ Impossible de récupérer les infos du groupe.', contextInfo: channelInfo }, { quoted: message });
    }
}

module.exports = groupInfoCommand;
