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

const MENU_IMAGE = 'https://i.ibb.co/ds0fdYCX/IMG-20260409-WA0249.jpg';

function getMenuImage() {
    try {
        const p = path.join(__dirname, '../data/menuimage.json');
        const url = JSON.parse(fs.readFileSync(p)).url;
        return url && url.startsWith('http') ? url : MENU_IMAGE;
    } catch { return MENU_IMAGE; }
}

async function helpCommand(sock, chatId, message) {
    const p = settings.prefix;
    const imageUrl = getMenuImage();

    const helpMessage = `╔═════════════════════╗
║   🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗-𝐕2* 🥷   ║
╠═════════════════════╣
║  🛠️  *Version* : v${settings.version}
║  👤 *Owner*   : IBSACKO
║  🌍 *Mode*    : ${settings.commandMode || 'Public'}
║  ✅ *Statut*  : En ligne
╚═════════════════════╝

🥷🇬🇳 *𝗜𝗕𝗥𝗔𝗛𝗜𝗠𝗔 𝗦𝗢𝗥𝗬 𝗦𝗔𝗖𝗞𝗢* 🇬🇳🥷

        *LISTE DES COMMANDES :*

              *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗*

🥷────────────────🥷
『 𝗚𝗘𝗡𝗘𝗥𝗔𝗟-𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗 』
│ ⬡ ${p}help → aide du bot
│ ⬡ ${p}menu → afficher le menu
│ ⬡ ${p}allmenu → toutes les cmds
│ ⬡ ${p}ping → vitesse du bot
│ ⬡ ${p}alive → état du bot
│ ⬡ ${p}uptime → temps en ligne
│ ⬡ ${p}tts → texte en audio
│ ⬡ ${p}owner → propriétaire
│ ⬡ ${p}joke → blague
│ ⬡ ${p}quote → citation
│ ⬡ ${p}fact → fait intéressant
│ ⬡ ${p}weather → météo
│ ⬡ ${p}news → actualités
│ ⬡ ${p}attp → texte en sticker
│ ⬡ ${p}lyrics → paroles musique
│ ⬡ ${p}8ball → boule magique
│ ⬡ ${p}groupinfo → infos groupe
│ ⬡ ${p}staff → staff du groupe
│ ⬡ ${p}humm → vue unique → MP
│ ⬡ ${p}trt → traduction
│ ⬡ ${p}ss → capture écran
│ ⬡ ${p}gjid → identifiant groupe
│ ⬡ ${p}url → lien raccourci
│ ⬡ ${p}theme → changer thème
│ ⬡ ${p}test → vérifier bot actif
│ ⬡ ${p}info → infos du bot
│ ⬡ ${p}contact → contact proprio
│ ⬡ ${p}loi → règles du groupe
│ ⬡ ${p}restore → restaurer config
│ ⬡ ${p}clan → gérer un clan
╰────────────────🥷

🥷────────────────🥷
『 𝗔𝗗𝗠𝗜𝗡-𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗 』
│ ⬡ ${p}open → ouvrir le groupe
│ ⬡ ${p}close → fermer le groupe
│ ⬡ ${p}ban → bannir membre
│ ⬡ ${p}kick → expulser membre
│ ⬡ ${p}warn → avertir membre
│ ⬡ ${p}promote → rendre admin
│ ⬡ ${p}demote → retirer admin
│ ⬡ ${p}mute → muter groupe
│ ⬡ ${p}unmute → démuter groupe
│ ⬡ ${p}delete → supprimer message
│ ⬡ ${p}clear → nettoyer chat
│ ⬡ ${p}tagall → mentionner tous
│ ⬡ ${p}tag → tag avec message
│ ⬡ ${p}hidetag → tag caché
│ ⬡ ${p}link → bloquer les liens
│ ⬡ ${p}gjid → id du groupe
│ ⬡ ${p}gstatus → statut groupe
│ ⬡ ${p}welcome → msg bienvenue
│ ⬡ ${p}goodbye → msg au revoir
│ ⬡ ${p}setgname → changer nom
│ ⬡ ${p}setgpp → photo du groupe
│ ⬡ ${p}kickall → expulser tous
│ ⬡ ${p}purge → nettoyer chat
│ ⬡ ${p}sanction → sanctionner membre
│ ⬡ ${p}autorecording → simulation audio
╰────────────────🥷

🥷────────────────🥷
『 𝗣𝗥𝗢𝗧𝗘𝗖𝗧𝗜𝗢𝗡-𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗 』
│ ⬡ ${p}antilink → anti-lien
│ ⬡ ${p}antibadword → anti-insultes
│ ⬡ ${p}antibot → bloquer bots
│ ⬡ ${p}antileave → anti-départ
│ ⬡ ${p}antimention → anti-spam
│ ⬡ ${p}antisticker → anti-sticker
│ ⬡ ${p}antitag → anti-tag abusif
│ ⬡ ${p}antimentionstatus → anti-mention statut
│ ⬡ ${p}anticall → bloquer appels
│ ⬡ ${p}antidelete → anti-suppression
│ ⬡ ${p}antipurge → anti-purge abusive
│ ⬡ ${p}antimarabout → anti-arnaques
╰────────────────🥷

🥷────────────────🥷
『 𝗢𝗪𝗡𝗘𝗥-𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗 』
│ ⬡ ${p}self → mode solo
│ ⬡ ${p}mode → public / privé
│ ⬡ ${p}setsudo → ajouter sudo
│ ⬡ ${p}listsudo → lister sudo
│ ⬡ ${p}delsudo → retirer sudo
│ ⬡ ${p}pair → code connexion
│ ⬡ ${p}prompt → comportement IA
│ ⬡ ${p}autoviewstatus → vue statuts
│ ⬡ ${p}autoreactstatus → réagir
│ ⬡ ${p}autostatus → statut auto
│ ⬡ ${p}autoread → lecture auto
│ ⬡ ${p}autotyping → frappe auto
│ ⬡ ${p}clearsession → session
│ ⬡ ${p}cleartmp → vider tmp
│ ⬡ ${p}update → mettre à jour
│ ⬡ ${p}settings → paramètres
│ ⬡ ${p}anticall → bloquer appels
│ ⬡ ${p}pmblocker → bloquer mp
│ ⬡ ${p}setpp → photo profil bot
│ ⬡ ${p}setmenuimage → image menu
│ ⬡ ${p}menustyle → style menu
╰────────────────🥷

🥷────────────────🥷
『 𝗘𝗗𝗜𝗧𝗜𝗡𝗚-𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗 』
│ ⬡ ${p}sticker → créer sticker
│ ⬡ ${p}toimage → sticker → image
│ ⬡ ${p}simage → sticker image
│ ⬡ ${p}take → modifier sticker
│ ⬡ ${p}save → sauvegarder média
│ ⬡ ${p}image → générer image
│ ⬡ ${p}remini → améliorer qualité
│ ⬡ ${p}removebg → enlever fond
│ ⬡ ${p}blur → flouter image
│ ⬡ ${p}crop → recadrer image
│ ⬡ ${p}meme → créer meme
│ ⬡ ${p}emojimix → mixer emojis
│ ⬡ ${p}igs → story instagram
│ ⬡ ${p}igsc → commentaires IG
╰────────────────🥷

🥷────────────────🥷
『 𝗔𝗜 & 𝗚𝗔𝗠𝗘𝗦-𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗 』
│ ⬡ ${p}ai → intelligence IA
│ ⬡ ${p}gpt → ChatGPT
│ ⬡ ${p}gemini → IA Gemini
│ ⬡ ${p}codeai → générer code IA
│ ⬡ ${p}imagine → image IA
│ ⬡ ${p}flux → image flux
│ ⬡ ${p}sora → vidéo IA
│ ⬡ ${p}tictactoe → jeu morpion
│ ⬡ ${p}hangman → jeu pendu
│ ⬡ ${p}trivia → quiz culture
│ ⬡ ${p}truth → vérité
│ ⬡ ${p}dare → action
╰────────────────🥷

🥷────────────────🥷
『 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥-𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗 』
│ ⬡ ${p}play → jouer musique
│ ⬡ ${p}song → télécharger musique
│ ⬡ ${p}video → télécharger vidéo
│ ⬡ ${p}spotify → musique spotify
│ ⬡ ${p}instagram → télécharger IG
│ ⬡ ${p}facebook → télécharger FB
│ ⬡ ${p}tiktok → télécharger TikTok
│ ⬡ ${p}lyrics → paroles musique
╰────────────────🥷

🥷────────────────🥷
『 𝗧𝗘𝗫𝗧𝗠𝗔𝗞𝗘𝗥-𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗 』
│ ⬡ ${p}neon → texte néon
│ ⬡ ${p}glitch → texte glitch
│ ⬡ ${p}fire → texte feu
│ ⬡ ${p}ice → texte glace
│ ⬡ ${p}snow → texte neige
│ ⬡ ${p}matrix → texte matrix
│ ⬡ ${p}hacker → style hacker
│ ⬡ ${p}devil → style démon
│ ⬡ ${p}sand → texte sable
╰────────────────🥷

🥷────────────────🥷
『 𝗦𝗬𝗦𝗧𝗘𝗠-𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗 』
│ ⬡ ${p}git → info git
│ ⬡ ${p}github → lien github
│ ⬡ ${p}sc → code source
│ ⬡ ${p}repo → dépôt bot
│ ⬡ ${p}script → script bot
╰────────────────🥷

🥷───────────────🥷
    ⚡ *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗 v2.0* ⚡
   propulsé par *𝗜𝗕𝗦𝗔𝗖𝗞𝗢™*
🥷───────────────🥷

*Rejoignez notre chaîne🔗👇:*`;

    try {
        await sock.sendMessage(chatId, {
            image: { url: imageUrl },
            caption: helpMessage,
            contextInfo: channelInfo
        }, { quoted: message });
    } catch (e) {
        console.error('❌ [help]', e.message);
        await sock.sendMessage(chatId, { text: helpMessage });
    }
}

module.exports = helpCommand;
