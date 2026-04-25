// poll, gcreate, join, leave, lock, unlock, kickall, vcf, tagadmin, acceptall, rejectall
const channelInfo = {
    forwardingScore: 1, isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363408304719268@newsletter',
        newsletterName: 'ITACHI-XMD', serverMessageId: -1
    }
};

// ─── POLL : Créer un sondage ─────────────────────────────
async function pollCommand(sock, chatId, args, message) {
    const input = args.join(' ');
    const parts = input.split('|').map(s => s.trim());
    if (parts.length < 3) {
        return await sock.sendMessage(chatId, {
            text: `╔═════════════════════╗\n║   🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗-𝐕2* 🥷   ║\n╚═════════════════════╝\n\n📊 *Créer un sondage*\n\n💡 *Usage :* *.poll Question | Option1 | Option2 | Option3*\n\n📌 *Exemple :*\n_.poll Couleur préférée ? | Rouge | Bleu | Vert_`,
            contextInfo: channelInfo
        }, { quoted: message });
    }
    const question = parts[0];
    const options = parts.slice(1);
    try {
        await sock.sendMessage(chatId, {
            poll: { name: question, values: options, selectableCount: 1 }
        }, { quoted: message });
    } catch (e) {
        await sock.sendMessage(chatId, { text: `❌ *Erreur :* ${e.message}`, contextInfo: channelInfo }, { quoted: message });
    }
}

// ─── GCREATE : Créer un groupe ───────────────────────────
async function gcreateCommand(sock, chatId, senderId, args, message) {
    const name = args.join(' ');
    if (!name) {
        return await sock.sendMessage(chatId, {
            text: `╔═════════════════════╗\n║   🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗-𝐕2* 🥷   ║\n╚═════════════════════╝\n\n👥 *Créer un groupe*\n\n💡 *Usage :* *.gcreate <nom du groupe>*`,
            contextInfo: channelInfo
        }, { quoted: message });
    }
    try {
        const group = await sock.groupCreate(name, [senderId]);
        await sock.sendMessage(chatId, {
            text: `╔═════════════════════╗\n║   🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗-𝐕2* 🥷   ║\n╚═════════════════════╝\n\n✅ *Groupe créé :* ${name}\n🆔 *JID :* ${group.gid}`,
            contextInfo: channelInfo
        }, { quoted: message });
    } catch (e) {
        await sock.sendMessage(chatId, { text: `❌ *Erreur :* ${e.message}`, contextInfo: channelInfo }, { quoted: message });
    }
}

// ─── JOIN : Rejoindre un groupe via lien ─────────────────
async function joinCommand(sock, chatId, args, message) {
    const link = args[0];
    if (!link) {
        return await sock.sendMessage(chatId, {
            text: `💡 *Usage :* *.join <lien du groupe>*\n_Exemple : .join https://chat.whatsapp.com/xxxxx_`,
            contextInfo: channelInfo
        }, { quoted: message });
    }
    try {
        const code = link.split('https://chat.whatsapp.com/')[1] || link;
        await sock.groupAcceptInvite(code);
        await sock.sendMessage(chatId, {
            text: `╔═════════════════════╗\n║   🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗-𝐕2* 🥷   ║\n╚═════════════════════╝\n\n✅ *Groupe rejoint avec succès !*`,
            contextInfo: channelInfo
        }, { quoted: message });
    } catch (e) {
        await sock.sendMessage(chatId, { text: `❌ *Erreur :* ${e.message}`, contextInfo: channelInfo }, { quoted: message });
    }
}

// ─── LEAVE : Quitter le groupe ───────────────────────────
async function leaveCommand(sock, chatId, message) {
    if (!chatId.endsWith('@g.us')) return await sock.sendMessage(chatId, { text: '❌ *Uniquement dans les groupes !*', contextInfo: channelInfo }, { quoted: message });
    try {
        await sock.sendMessage(chatId, { text: `👋 *Le bot quitte le groupe...*\n_Au revoir !_ 🥷`, contextInfo: channelInfo }, { quoted: message });
        await new Promise(r => setTimeout(r, 2000));
        await sock.groupLeave(chatId);
    } catch (e) {
        await sock.sendMessage(chatId, { text: `❌ *Erreur :* ${e.message}`, contextInfo: channelInfo }, { quoted: message });
    }
}

// ─── LOCK : Fermer le groupe ─────────────────────────────
async function lockCommand(sock, chatId, message) {
    if (!chatId.endsWith('@g.us')) return await sock.sendMessage(chatId, { text: '❌ *Uniquement dans les groupes !*', contextInfo: channelInfo }, { quoted: message });
    try {
        await sock.groupSettingUpdate(chatId, 'announcement');
        await sock.sendMessage(chatId, {
            text: `╔═════════════════════╗\n║   🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗-𝐕2* 🥷   ║\n╚═════════════════════╝\n\n🔒 *Groupe verrouillé !*\n_Seuls les admins peuvent écrire._`,
            contextInfo: channelInfo
        }, { quoted: message });
    } catch (e) {
        await sock.sendMessage(chatId, { text: `❌ *Erreur :* ${e.message}`, contextInfo: channelInfo }, { quoted: message });
    }
}

// ─── UNLOCK : Ouvrir le groupe ───────────────────────────
async function unlockCommand(sock, chatId, message) {
    if (!chatId.endsWith('@g.us')) return await sock.sendMessage(chatId, { text: '❌ *Uniquement dans les groupes !*', contextInfo: channelInfo }, { quoted: message });
    try {
        await sock.groupSettingUpdate(chatId, 'not_announcement');
        await sock.sendMessage(chatId, {
            text: `╔═════════════════════╗\n║   🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗-𝐕2* 🥷   ║\n╚═════════════════════╝\n\n🔓 *Groupe déverrouillé !*\n_Tout le monde peut écrire._`,
            contextInfo: channelInfo
        }, { quoted: message });
    } catch (e) {
        await sock.sendMessage(chatId, { text: `❌ *Erreur :* ${e.message}`, contextInfo: channelInfo }, { quoted: message });
    }
}

// ─── KICKALL : Expulser tous les membres non-admins ──────
async function kickallCommand(sock, chatId, message) {
    if (!chatId.endsWith('@g.us')) return await sock.sendMessage(chatId, { text: '❌ *Uniquement dans les groupes !*', contextInfo: channelInfo }, { quoted: message });
    try {
        const meta = await sock.groupMetadata(chatId);
        const nonAdmins = meta.participants.filter(p => !p.admin).map(p => p.id);
        if (nonAdmins.length === 0) {
            return await sock.sendMessage(chatId, { text: `ℹ️ *Aucun membre non-admin à expulser.*`, contextInfo: channelInfo }, { quoted: message });
        }
        await sock.sendMessage(chatId, { text: `⏳ *Expulsion de ${nonAdmins.length} membres...*`, contextInfo: channelInfo }, { quoted: message });
        await sock.groupParticipantsUpdate(chatId, nonAdmins, 'remove');
        await sock.sendMessage(chatId, {
            text: `╔═════════════════════╗\n║   🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗-𝐕2* 🥷   ║\n╚═════════════════════╝\n\n✅ *${nonAdmins.length} membres expulsés !*`,
            contextInfo: channelInfo
        }, { quoted: message });
    } catch (e) {
        await sock.sendMessage(chatId, { text: `❌ *Erreur :* ${e.message}`, contextInfo: channelInfo }, { quoted: message });
    }
}

// ─── VCF : Obtenir le contact d'un membre ───────────────
async function vcfCommand(sock, chatId, senderId, replyMessage, message) {
    let targetJid = null;
    const mentioned = message.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    if (replyMessage) {
        targetJid = message.message?.extendedTextMessage?.contextInfo?.participant || senderId;
    } else if (mentioned) {
        targetJid = mentioned;
    } else {
        targetJid = senderId;
    }

    const num = targetJid.replace(/:\d+@/, '@').split('@')[0];
    const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:+${num}\nTEL;waid=${num}:+${num}\nEND:VCARD`;
    try {
        await sock.sendMessage(chatId, {
            contacts: { displayName: `+${num}`, contacts: [{ vcard }] }
        }, { quoted: message });
    } catch (e) {
        await sock.sendMessage(chatId, { text: `❌ *Erreur :* ${e.message}`, contextInfo: channelInfo }, { quoted: message });
    }
}

// ─── TAGADMIN : Mentionner tous les admins ───────────────
async function tagadminCommand(sock, chatId, args, message) {
    if (!chatId.endsWith('@g.us')) return await sock.sendMessage(chatId, { text: '❌ *Uniquement dans les groupes !*', contextInfo: channelInfo }, { quoted: message });
    try {
        const meta = await sock.groupMetadata(chatId);
        const admins = meta.participants.filter(p => p.admin);
        if (admins.length === 0) return await sock.sendMessage(chatId, { text: `ℹ️ *Aucun admin trouvé.*`, contextInfo: channelInfo }, { quoted: message });
        const mentions = admins.map(a => a.id);
        let list = admins.map((a, i) => `│ ${a.admin === 'superadmin' ? '👑' : '⭐'} @${a.id.split('@')[0]}`).join('\n');
        await sock.sendMessage(chatId, {
            image: { url: 'https://i.ibb.co/ds0fdYCX/IMG-20260409-WA0249.jpg' },
            caption: `╔═════════════════════╗\n║   🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗-𝐕2* 🥷   ║\n╠═════════════════════╣\n║   👑 *TAG ADMINS*          ║\n╚═════════════════════╝\n\n${args.join(' ') || '📢 Attention admins !'}\n\n┌─────────────────────\n${list}\n└─────────────────────`,
            mentions,
            contextInfo: channelInfo
        }, { quoted: message });
    } catch (e) {
        await sock.sendMessage(chatId, { text: `❌ *Erreur :* ${e.message}`, contextInfo: channelInfo }, { quoted: message });
    }
}

// ─── ACCEPTALL : Accepter toutes les demandes ────────────
async function acceptallCommand(sock, chatId, message) {
    if (!chatId.endsWith('@g.us')) return await sock.sendMessage(chatId, { text: '❌ *Uniquement dans les groupes !*', contextInfo: channelInfo }, { quoted: message });
    try {
        const requests = await sock.groupRequestParticipantsList(chatId);
        if (!requests || requests.length === 0) {
            return await sock.sendMessage(chatId, { text: `ℹ️ *Aucune demande en attente.*`, contextInfo: channelInfo }, { quoted: message });
        }
        await sock.groupRequestParticipantsUpdate(chatId, requests.map(r => r.jid), 'approve');
        await sock.sendMessage(chatId, {
            text: `╔═════════════════════╗\n║   🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗-𝐕2* 🥷   ║\n╚═════════════════════╝\n\n✅ *${requests.length} demandes acceptées !*`,
            contextInfo: channelInfo
        }, { quoted: message });
    } catch (e) {
        await sock.sendMessage(chatId, { text: `❌ *Erreur :* ${e.message}`, contextInfo: channelInfo }, { quoted: message });
    }
}

// ─── REJECTALL : Rejeter toutes les demandes ────────────
async function rejectallCommand(sock, chatId, message) {
    if (!chatId.endsWith('@g.us')) return await sock.sendMessage(chatId, { text: '❌ *Uniquement dans les groupes !*', contextInfo: channelInfo }, { quoted: message });
    try {
        const requests = await sock.groupRequestParticipantsList(chatId);
        if (!requests || requests.length === 0) {
            return await sock.sendMessage(chatId, { text: `ℹ️ *Aucune demande en attente.*`, contextInfo: channelInfo }, { quoted: message });
        }
        await sock.groupRequestParticipantsUpdate(chatId, requests.map(r => r.jid), 'reject');
        await sock.sendMessage(chatId, {
            text: `╔═════════════════════╗\n║   🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗-𝐕2* 🥷   ║\n╚═════════════════════╝\n\n🚫 *${requests.length} demandes rejetées !*`,
            contextInfo: channelInfo
        }, { quoted: message });
    } catch (e) {
        await sock.sendMessage(chatId, { text: `❌ *Erreur :* ${e.message}`, contextInfo: channelInfo }, { quoted: message });
    }
}

module.exports = {
    pollCommand, gcreateCommand, joinCommand, leaveCommand,
    lockCommand, unlockCommand, kickallCommand, vcfCommand,
    tagadminCommand, acceptallCommand, rejectallCommand
};
