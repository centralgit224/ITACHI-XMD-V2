// Allmenu → Affiche toutes les commandes disponibles v2.0
const settings = require('../settings');
const fs = require('fs');
const path = require('path');

const channelInfo = {
    forwardingScore: 1, isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363408304719268@newsletter',
        newsletterName: 'ITACHI-XMD', serverMessageId: -1
    }
};

const menuImagePath = path.join(__dirname, '../data/menuimage.json');
function getMenuImage() {
    try { return JSON.parse(fs.readFileSync(menuImagePath)).url; }
    catch { return 'https://i.ibb.co/zTpCpsDD/54c381553462489288313ec73a0bbfe8.jpg'; }
}

async function allmenuCommand(sock, chatId, message) {
    const p = settings.prefix;
    const imageUrl = getMenuImage();

    const sections = [
        {
            title: '🌐 GÉNÉRAL',
            cmds: [
                ['help', 'Aide du bot'],
                ['menu', 'Menu principal'],
                ['allmenu', 'Toutes les commandes'],
                ['ping', 'Vitesse du bot'],
                ['alive', 'État du bot'],
                ['uptime', "Temps d'activité"],
                ['owner', 'Propriétaire'],
                ['theme', 'Changer le thème (1-8)'],
                ['humm', 'Média → Vue unique MP'],
            ]
        },
        {
            title: '🔒 GESTION GROUPE',
            cmds: [
                ['open', 'Ouvrir le groupe 🔓'],
                ['close', 'Fermer le groupe 🔒'],
                ['tag', 'Mentionner tous les membres'],
                ['hidetag', 'Tag caché (sans noms)'],
                ['link', 'Bloquer/autoriser les liens'],
                ['gjid', 'Identifiant du groupe'],
                ['gstatus', 'Infos & modifier le groupe'],
                ['groupinfo', 'Infos complètes du groupe'],
            ]
        },
        {
            title: '👑 ADMIN',
            cmds: [
                ['ban', 'Bannir un membre'],
                ['kick', 'Expulser un membre'],
                ['warn', 'Avertir un membre'],
                ['promote', 'Rendre admin'],
                ['demote', 'Retirer admin'],
                ['mute', 'Muter le groupe'],
                ['unmute', 'Démuter le groupe'],
                ['delete', 'Supprimer un message'],
                ['tagall', 'Mentionner tout le monde'],
            ]
        },
        {
            title: '🛡️ PROTECTION',
            cmds: [
                ['antilink', 'Anti-lien complet'],
                ['link', 'Bloquer les liens (rapide)'],
                ['antibadword', 'Anti-insultes'],
                ['antibot', 'Bloquer autres bots 🤖'],
                ['antileave', 'Anti-départ membres 🚫'],
                ['antimention', 'Anti-spam mentions ❌'],
                ['antisticker', 'Bloquer les stickers 🚫'],
                ['antitag', 'Anti-tag abusif ❌'],
                ['antistatusmention', 'Anti-mention via statut'],
                ['anticall', 'Bloquer les appels'],
                ['antidelete', 'Anti-suppression'],
            ]
        },
        {
            title: '⚙️ PROPRIÉTAIRE',
            cmds: [
                ['self', 'Mode privé (solo) 🔐'],
                ['setsudo', 'Ajouter un sudo 👑'],
                ['listsudo', 'Lister les sudos 📋'],
                ['delsudo', 'Supprimer un sudo ❌'],
                ['pair', 'Code de connexion bot 📲'],
                ['prompt', 'Comportement de l\'IA 🤖'],
                ['autoviewstatus', 'Vue auto statuts 👁️'],
                ['autoreactstatus', 'Réaction auto statuts 🔥'],
                ['autostatus', 'Gérer les statuts auto'],
                ['autotyping', 'Simuler la frappe ✍️'],
                ['autoread', 'Lecture auto messages'],
                ['setmenuimage', 'Changer image du menu'],
                ['menustyle', 'Changer style du menu'],
                ['clearsession', 'Supprimer la session'],
                ['cleartmp', 'Vider fichiers temporaires'],
                ['update', 'Mettre à jour le bot'],
                ['settings', 'Paramètres du bot'],
            ]
        },
        {
            title: '🎨 MÉDIA & ÉDITION',
            cmds: [
                ['sticker', 'Créer un sticker'],
                ['toimage', 'Sticker → Image 🖼️'],
                ['take', 'Modifier nom d\'un sticker 🧩'],
                ['save', 'Sauvegarder un média 💾'],
                ['image', 'Générer une image 🖼️'],
                ['removebg', 'Enlever le fond'],
                ['remini', 'Améliorer qualité photo'],
                ['blur', 'Flouter une image'],
                ['emojimix', 'Mixer des emojis'],
                ['attp', 'Texte → Sticker animé'],
                ['gif', 'Chercher un GIF'],
            ]
        },
        {
            title: '🤖 IA & JEUX',
            cmds: [
                ['ai', 'Poser une question à l\'IA'],
                ['codeai', 'Générer du code 💻'],
                ['imagine', 'Créer une image avec l\'IA'],
                ['tictactoe', 'Jeu Morpion'],
                ['hangman', 'Jeu du Pendu'],
                ['trivia', 'Quiz culture générale'],
                ['truth', 'Vérité ou...'],
                ['dare', '...Action !'],
            ]
        },
        {
            title: '⬇️ TÉLÉCHARGEMENTS',
            cmds: [
                ['play', 'Jouer de la musique'],
                ['song', 'Télécharger musique 🎵'],
                ['video', 'Télécharger une vidéo 🎬'],
                ['tiktok', 'Télécharger TikTok'],
                ['instagram', 'Télécharger Instagram'],
                ['facebook', 'Télécharger Facebook'],
                ['spotify', 'Musique Spotify'],
                ['lyrics', 'Paroles d\'une chanson 🎵'],
            ]
        },
        {
            title: '🌅 ACCUEIL & STATUTS',
            cmds: [
                ['welcome', 'Message de bienvenue'],
                ['goodbye', 'Message d\'au revoir'],
                ['antileave', 'Anti-départ groupe'],
            ]
        }
    ];

    let fullMenu = `╔════════════════════════╗\n║  🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗 v2.0* 🥷   ║\n╠════════════════════════╣\n║   📋 *TOUTES LES CMDS*    ║\n║   👤 Owner : IBSACKO     ║\n║   📦 v${settings.version} | ${settings.prefix}commande  ║\n╚════════════════════════╝\n\n`;

    for (const sec of sections) {
        fullMenu += `🥷────────────────🥷\n╔══ ${sec.title}\n`;
        sec.cmds.forEach(([cmd, desc]) => {
            fullMenu += `│ ⬡ ${p}${cmd} → ${desc}\n`;
        });
        fullMenu += `╚────────────────🥷\n\n`;
    }

    fullMenu += `🥷───────────────🥷\n      ⚡ *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗 v2.0* ⚡\n  _propulsé par_ *𝗜𝗕𝗦𝗔𝗖𝗞𝗢™*\n🥷───────────────🥷`;

    await sock.sendMessage(chatId, {
        image: { url: imageUrl },
        caption: fullMenu,
        contextInfo: channelInfo
    }, { quoted: message });
}

module.exports = allmenuCommand;
