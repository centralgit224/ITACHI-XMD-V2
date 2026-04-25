// Gstatus → Voir et gérer les statuts WhatsApp des membres du groupe
const isAdmin = require('../lib/isAdmin');
const isOwnerOrSudo = require('../lib/isOwner');

const channelInfo = {
    forwardingScore: 1, isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363408304719268@newsletter',
        newsletterName: 'ITACHI-XMD', serverMessageId: -1
    }
};

async function gstatusCommand(sock, chatId, senderId, args, message) {
    if (!chatId.endsWith('@g.us')) {
        return await sock.sendMessage(chatId, { text: '❌ *Uniquement dans les groupes !*', contextInfo: channelInfo }, { quoted: message });
    }

    const { isSenderAdmin } = await isAdmin(sock, chatId, senderId);
    if (!isSenderAdmin) {
        return await sock.sendMessage(chatId, {
            text: `╔══════════════════════╗\n║   🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗* 🥷   ║\n╚══════════════════════╝\n\n❌ *Réservé aux admins !*`,
            contextInfo: channelInfo
        }, { quoted: message });
    }

    const action = args[0]?.toLowerCase();

    try {
        const meta = await sock.groupMetadata(chatId);
        const participants = meta.participants;
        const total = participants.length;
        const admins = participants.filter(p => p.admin).length;
        const members = total - admins;
        const createdAt = meta.creation ? new Date(meta.creation * 1000).toLocaleDateString('fr-FR') : 'Inconnu';

        if (!action) {
            // Affiche les infos et statuts du groupe
            let adminList = '';
            participants.filter(p => p.admin).forEach((p, i) => {
                const role = p.admin === 'superadmin' ? '👑' : '⭐';
                adminList += `│ ${role} +${p.id.split('@')[0]}\n`;
            });

            return await sock.sendMessage(chatId, {
                image: { url: 'https://i.ibb.co/zTpCpsDD/54c381553462489288313ec73a0bbfe8.jpg' },
                caption: `╔═══════════════════════╗\n║  🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗 v2.0* 🥷  ║\n╠═══════════════════════╣\n║   📊 *STATUT DU GROUPE*   ║\n╚═══════════════════════╝\n\n👥 *Groupe :* ${meta.subject}\n📅 *Créé le :* ${createdAt}\n🆔 *JID :* \`${chatId}\`\n\n┌──────────────────────\n│ 👤 Membres : *${members}*\n│ 👑 Admins : *${admins}*\n│ 📊 Total : *${total}*\n│ 🔒 Annonce : *${meta.announce ? 'Oui (fermé)' : 'Non (ouvert)'}*\n│ 🔐 Restriction : *${meta.restrict ? 'Admin seulement' : 'Tous'}*\n└──────────────────────\n\n👑 *Admins du groupe :*\n┌──────────────────────\n${adminList}└──────────────────────\n\n📌 *Options :*\n│ ⬡ .gstatus desc <texte> → Modifier desc\n│ ⬡ .gstatus nom <texte> → Modifier nom\n\n> _Propulsé par 🥷 IBSACKO™_`,
                contextInfo: channelInfo
            }, { quoted: message });
        }

        const { isBotAdmin } = await isAdmin(sock, chatId, senderId);

        if (action === 'desc') {
            const desc = args.slice(1).join(' ');
            if (!desc) return await sock.sendMessage(chatId, { text: '❌ *Spécifie la description !*\n_Ex : .gstatus desc Mon super groupe_', contextInfo: channelInfo }, { quoted: message });
            await sock.groupUpdateDescription(chatId, desc);
            return await sock.sendMessage(chatId, {
                text: `╔═══════════════════════╗\n║  🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗 v2.0* 🥷  ║\n╚═══════════════════════╝\n\n✅ *Description du groupe mise à jour !*\n\n📝 *Nouvelle description :*\n${desc}`,
                contextInfo: channelInfo
            }, { quoted: message });
        }

        if (action === 'nom') {
            const nom = args.slice(1).join(' ');
            if (!nom) return await sock.sendMessage(chatId, { text: '❌ *Spécifie le nouveau nom !*\n_Ex : .gstatus nom Mon Groupe 2.0_', contextInfo: channelInfo }, { quoted: message });
            await sock.groupUpdateSubject(chatId, nom);
            return await sock.sendMessage(chatId, {
                text: `╔═══════════════════════╗\n║  🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗 v2.0* 🥷  ║\n╚═══════════════════════╝\n\n✅ *Nom du groupe mis à jour !*\n\n📛 *Nouveau nom :* ${nom}`,
                contextInfo: channelInfo
            }, { quoted: message });
        }

    } catch (e) {
        console.error('❌ [gstatus]', e.message);
        await sock.sendMessage(chatId, { text: '❌ *Erreur lors de la récupération des infos du groupe.*', contextInfo: channelInfo }, { quoted: message });
    }
}

module.exports = gstatusCommand;
