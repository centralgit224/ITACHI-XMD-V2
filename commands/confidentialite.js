// getprivacy, lastseen, online, presence, setbio, mypp, mystatus, groupadd, read
const channelInfo = {
    forwardingScore: 1, isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363408304719268@newsletter',
        newsletterName: 'ITACHI-XMD', serverMessageId: -1
    }
};

// ─── GETPRIVACY : Voir les paramètres de confidentialité ─
async function getprivacyCommand(sock, chatId, message) {
    try {
        const privacy = await sock.fetchPrivacySettings(true);
        const f = (v) => ({ 'all': '🌍 Tout le monde', 'contacts': '👥 Contacts', 'contact_blacklist': '❌ Sauf certains', 'none': '🔒 Personne' }[v] || v);
        await sock.sendMessage(chatId, {
            image: { url: 'https://i.ibb.co/ds0fdYCX/IMG-20260409-WA0249.jpg' },
            caption: `╔═════════════════════╗\n║   🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗-𝐕2* 🥷   ║\n╠═════════════════════╣\n║   🔒 *CONFIDENTIALITÉ*     ║\n╚═════════════════════╝\n\n┌─────────────────────\n│ 👁️ *Vu en dernier :* ${f(privacy.last)}\n│ 📸 *Photo de profil :* ${f(privacy.profile)}\n│ ℹ️ *Info perso :* ${f(privacy.status)}\n│ 🟢 *En ligne :* ${f(privacy.online)}\n│ 👥 *Groupes :* ${f(privacy.groupadd)}\n│ 📞 *Appels :* ${f(privacy.calladd)}\n└─────────────────────\n\n> _Propulsé par 🥷 *IBSACKO™*_`,
            contextInfo: channelInfo
        }, { quoted: message });
    } catch (e) {
        await sock.sendMessage(chatId, { text: `❌ *Erreur :* ${e.message}`, contextInfo: channelInfo }, { quoted: message });
    }
}

// ─── LASTSEEN : Modifier qui voit le vu en dernier ───────
async function lastseenCommand(sock, chatId, args, message) {
    const val = args[0]?.toLowerCase();
    const opts = { 'all': 'tout le monde', 'contacts': 'contacts', 'none': 'personne' };
    if (!val || !opts[val]) {
        return await sock.sendMessage(chatId, {
            text: `╔═════════════════════╗\n║   🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗-𝐕2* 🥷   ║\n╚═════════════════════╝\n\n👁️ *Vu en dernier*\n\n💡 *Usage :* *.lastseen <option>*\n┌─────────────────────\n│ ⬡ .lastseen all → Tout le monde\n│ ⬡ .lastseen contacts → Contacts\n│ ⬡ .lastseen none → Personne\n└─────────────────────`,
            contextInfo: channelInfo
        }, { quoted: message });
    }
    try {
        await sock.updateLastSeenPrivacy(val);
        await sock.sendMessage(chatId, { text: `✅ *Vu en dernier :* ${opts[val]}`, contextInfo: channelInfo }, { quoted: message });
    } catch (e) {
        await sock.sendMessage(chatId, { text: `❌ *Erreur :* ${e.message}`, contextInfo: channelInfo }, { quoted: message });
    }
}

// ─── ONLINE : Modifier qui voit quand le bot est en ligne ─
async function onlineCommand(sock, chatId, args, message) {
    const val = args[0]?.toLowerCase();
    if (!val || !['all', 'match_last_seen'].includes(val)) {
        return await sock.sendMessage(chatId, {
            text: `💡 *Usage :* *.online <option>*\n┌─────────────────────\n│ ⬡ .online all → Tout le monde\n│ ⬡ .online match_last_seen → Comme vu en dernier\n└─────────────────────`,
            contextInfo: channelInfo
        }, { quoted: message });
    }
    try {
        await sock.updateOnlinePrivacy(val);
        await sock.sendMessage(chatId, { text: `✅ *Statut en ligne :* ${val}`, contextInfo: channelInfo }, { quoted: message });
    } catch (e) {
        await sock.sendMessage(chatId, { text: `❌ *Erreur :* ${e.message}`, contextInfo: channelInfo }, { quoted: message });
    }
}

// ─── PRESENCE : Envoyer une présence ─────────────────────
async function presenceCommand(sock, chatId, args, message) {
    const types = { 'online': 'available', 'typing': 'composing', 'recording': 'recording', 'offline': 'unavailable' };
    const type = args[0]?.toLowerCase() || 'online';
    const presence = types[type] || 'available';
    try {
        await sock.sendPresenceUpdate(presence, chatId);
        await sock.sendMessage(chatId, { text: `✅ *Présence :* ${type}`, contextInfo: channelInfo }, { quoted: message });
    } catch (e) {
        await sock.sendMessage(chatId, { text: `❌ *Erreur :* ${e.message}`, contextInfo: channelInfo }, { quoted: message });
    }
}

// ─── SETBIO : Modifier la bio du bot ─────────────────────
async function setbioCommand(sock, chatId, args, message) {
    const bio = args.join(' ');
    if (!bio) {
        return await sock.sendMessage(chatId, {
            text: `💡 *Usage :* *.setbio <texte>*\n_Exemple : .setbio 🥷 ITACHI-XMD v2.0_`,
            contextInfo: channelInfo
        }, { quoted: message });
    }
    try {
        await sock.updateProfileStatus(bio);
        await sock.sendMessage(chatId, {
            text: `╔═════════════════════╗\n║   🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗-𝐕2* 🥷   ║\n╚═════════════════════╝\n\n✅ *Bio mise à jour !*\n📝 ${bio}`,
            contextInfo: channelInfo
        }, { quoted: message });
    } catch (e) {
        await sock.sendMessage(chatId, { text: `❌ *Erreur :* ${e.message}`, contextInfo: channelInfo }, { quoted: message });
    }
}

// ─── MYPP : Voir la photo de profil du bot ───────────────
async function myppCommand(sock, chatId, message) {
    try {
        const pp = await sock.profilePictureUrl(sock.user.id, 'image');
        await sock.sendMessage(chatId, {
            image: { url: pp },
            caption: `╔═════════════════════╗\n║   🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗-𝐕2* 🥷   ║\n╚═════════════════════╝\n\n📸 *Photo de profil du bot*\n\n> _Propulsé par 🥷 *IBSACKO™*_`,
            contextInfo: channelInfo
        }, { quoted: message });
    } catch (e) {
        await sock.sendMessage(chatId, { text: `❌ *Impossible de récupérer la photo de profil.*`, contextInfo: channelInfo }, { quoted: message });
    }
}

// ─── MYSTATUS : Voir le statut/bio du bot ────────────────
async function mystatusCommand(sock, chatId, message) {
    try {
        const status = await sock.fetchStatus(sock.user.id);
        await sock.sendMessage(chatId, {
            text: `╔═════════════════════╗\n║   🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗-𝐕2* 🥷   ║\n╠═════════════════════╣\n║   ℹ️ *BIO DU BOT*          ║\n╚═════════════════════╝\n\n📝 *Bio :* ${status?.status || '_Aucune bio_'}\n📅 *Définie le :* ${status?.setAt ? new Date(status.setAt).toLocaleDateString('fr-FR') : 'Inconnu'}`,
            contextInfo: channelInfo
        }, { quoted: message });
    } catch (e) {
        await sock.sendMessage(chatId, { text: `❌ *Erreur :* ${e.message}`, contextInfo: channelInfo }, { quoted: message });
    }
}

// ─── GROUPADD : Modifier qui peut ajouter dans des groupes
async function groupaddCommand(sock, chatId, args, message) {
    const val = args[0]?.toLowerCase();
    const opts = { 'all': 'tout le monde', 'contacts': 'contacts', 'contact_blacklist': 'sauf certains', 'none': 'personne' };
    if (!val || !opts[val]) {
        return await sock.sendMessage(chatId, {
            text: `💡 *Usage :* *.groupadd <option>*\n┌─────────────────────\n│ ⬡ .groupadd all\n│ ⬡ .groupadd contacts\n│ ⬡ .groupadd none\n└─────────────────────`,
            contextInfo: channelInfo
        }, { quoted: message });
    }
    try {
        await sock.updateGroupsAddPrivacy(val);
        await sock.sendMessage(chatId, { text: `✅ *Qui peut m'ajouter dans des groupes :* ${opts[val]}`, contextInfo: channelInfo }, { quoted: message });
    } catch (e) {
        await sock.sendMessage(chatId, { text: `❌ *Erreur :* ${e.message}`, contextInfo: channelInfo }, { quoted: message });
    }
}

// ─── READ : Marquer tous les messages comme lus ──────────
async function readCommand(sock, chatId, message) {
    try {
        await sock.sendReadReceipt(chatId, null, [message.key.id]);
        await sock.sendMessage(chatId, { react: { text: '✅', key: message.key } });
    } catch (e) {
        await sock.sendMessage(chatId, { text: `❌ *Erreur :* ${e.message}`, contextInfo: channelInfo }, { quoted: message });
    }
}

module.exports = {
    getprivacyCommand, lastseenCommand, onlineCommand, presenceCommand,
    setbioCommand, myppCommand, mystatusCommand, groupaddCommand, readCommand
};
