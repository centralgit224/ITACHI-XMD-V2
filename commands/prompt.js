// Prompt → Définit le comportement / la personnalité de l'IA du bot
const fs = require('fs');
const path = require('path');
const isOwnerOrSudo = require('../lib/isOwner');

const promptPath = path.join(__dirname, '../data/prompt.json');
const channelInfo = {
    forwardingScore: 1, isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363408304719268@newsletter',
        newsletterName: 'ITACHI-XMD', serverMessageId: -1
    }
};

const DEFAULT_PROMPT = "Tu es ITACHI-XMD, un assistant WhatsApp intelligent, utile et sympa. Tu réponds toujours en français de façon claire et concise.";

if (!fs.existsSync(promptPath)) {
    fs.writeFileSync(promptPath, JSON.stringify({ prompt: DEFAULT_PROMPT }));
}
function getPrompt() {
    try { return JSON.parse(fs.readFileSync(promptPath)).prompt || DEFAULT_PROMPT; }
    catch { return DEFAULT_PROMPT; }
}
function savePrompt(p) { fs.writeFileSync(promptPath, JSON.stringify({ prompt: p }, null, 2)); }

async function promptCommand(sock, chatId, senderId, args, message) {
    const action = args[0]?.toLowerCase();
    const current = getPrompt();

    // Afficher le prompt actuel
    if (!action) {
        return await sock.sendMessage(chatId, {
            image: { url: 'https://i.ibb.co/zTpCpsDD/54c381553462489288313ec73a0bbfe8.jpg' },
            caption: `╔═══════════════════════╗\n║  🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗 v2.0* 🥷  ║\n╠═══════════════════════╣\n║   🤖 *COMPORTEMENT IA*   ║\n╚═══════════════════════╝\n\n📝 *Prompt actuel :*\n┌──────────────────────\n│ ${current}\n└──────────────────────\n\n📌 *Commandes :*\n┌──────────────────────\n│ ⬡ .prompt set <texte>\n│   → Définir un nouveau comportement\n│ ⬡ .prompt reset\n│   → Remettre le comportement par défaut\n│ ⬡ .prompt voir\n│   → Voir le prompt actuel\n└──────────────────────\n\n💡 *Exemples :*\n┌──────────────────────\n│ .prompt set Tu es un assistant médical\n│ .prompt set Réponds toujours avec humour\n│ .prompt set Tu es un expert en cuisine\n└──────────────────────\n\n> _Propulsé par 🥷 IBSACKO™_`,
            contextInfo: channelInfo
        }, { quoted: message });
    }

    if (action === 'set') {
        const newPrompt = args.slice(1).join(' ');
        if (!newPrompt) {
            return await sock.sendMessage(chatId, {
                text: `❌ *Spécifie un comportement !*\n_Ex : .prompt set Tu es un expert en finance_`,
                contextInfo: channelInfo
            }, { quoted: message });
        }
        savePrompt(newPrompt);
        return await sock.sendMessage(chatId, {
            text: `╔═══════════════════════╗\n║  🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗 v2.0* 🥷  ║\n╚═══════════════════════╝\n\n✅ *Comportement IA mis à jour !*\n\n📝 *Nouveau prompt :*\n┌──────────────────────\n│ ${newPrompt}\n└──────────────────────\n\n> _L'IA adoptera ce comportement dorénavant._`,
            contextInfo: channelInfo
        }, { quoted: message });
    }

    if (action === 'reset') {
        savePrompt(DEFAULT_PROMPT);
        return await sock.sendMessage(chatId, {
            text: `╔═══════════════════════╗\n║  🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗 v2.0* 🥷  ║\n╚═══════════════════════╝\n\n🔄 *Comportement IA réinitialisé !*\n\n📝 *Prompt par défaut restauré :*\n┌──────────────────────\n│ ${DEFAULT_PROMPT}\n└──────────────────────`,
            contextInfo: channelInfo
        }, { quoted: message });
    }

    if (action === 'voir') {
        return await sock.sendMessage(chatId, {
            text: `╔═══════════════════════╗\n║  🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗 v2.0* 🥷  ║\n╠═══════════════════════╣\n║   🤖 *PROMPT ACTUEL*     ║\n╚═══════════════════════╝\n\n📝 *Comportement IA :*\n┌──────────────────────\n│ ${current}\n└──────────────────────`,
            contextInfo: channelInfo
        }, { quoted: message });
    }
}

// Export du prompt pour l'utiliser dans les commandes AI
module.exports = promptCommand;
module.exports.getPrompt = getPrompt;
