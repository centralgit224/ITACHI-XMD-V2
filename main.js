require('dotenv').config();
// 🧹 Fix for ENOSPC / temp overflow in hosted panels
const fs = require('fs');
const path = require('path');

// Redirect temp storage away from system /tmp
const customTemp = path.join(process.cwd(), 'temp');
if (!fs.existsSync(customTemp)) fs.mkdirSync(customTemp, { recursive: true });
process.env.TMPDIR = customTemp;
process.env.TEMP = customTemp;
process.env.TMP = customTemp;

// Auto-cleaner every 3 hours
setInterval(() => {
    fs.readdir(customTemp, (err, files) => {
        if (err) return;
        for (const file of files) {
            const filePath = path.join(customTemp, file);
            fs.stat(filePath, (err, stats) => {
                if (!err && Date.now() - stats.mtimeMs > 3 * 60 * 60 * 1000) {
                    fs.unlink(filePath, () => { });
                }
            });
        }
    });
    console.log('🧹 Temp folder auto-cleaned');
}, 3 * 60 * 60 * 1000);

const settings = require('./settings');
const { setprefixCommand, getCurrentPrefix, VALID_PREFIXES } = require('./commands/setprefix');
require('./config.js');
const { isBanned } = require('./lib/isBanned');
const yts = require('yt-search');
const { fetchBuffer } = require('./lib/myfunc');
const fetch = require('node-fetch');
const ytdl = require('ytdl-core');
const axios = require('axios');
const ffmpeg = require('fluent-ffmpeg');
const { isSudo } = require('./lib/index');
const isOwnerOrSudo = require('./lib/isOwner');
const { autotypingCommand, isAutotypingEnabled, handleAutotypingForMessage, handleAutotypingForCommand, showTypingAfterCommand } = require('./commands/autotyping');
const { autoreadCommand, isAutoreadEnabled, handleAutoread } = require('./commands/autoread');

// Command imports
const tagAllCommand = require('./commands/tagall');
const helpCommand = require('./commands/help');
const banCommand = require('./commands/ban');
const { promoteCommand } = require('./commands/promote');
const { demoteCommand } = require('./commands/demote');
const muteCommand = require('./commands/mute');
const unmuteCommand = require('./commands/unmute');
const stickerCommand = require('./commands/sticker');
const isAdmin = require('./lib/isAdmin');
const warnCommand = require('./commands/warn');
const warningsCommand = require('./commands/warnings');
const ttsCommand = require('./commands/tts');
const { tictactoeCommand, handleTicTacToeMove } = require('./commands/tictactoe');
const { incrementMessageCount, topMembers } = require('./commands/topmembers');
const ownerCommand = require('./commands/owner');
const deleteCommand = require('./commands/delete');
const { handleAntilinkCommand, handleLinkDetection } = require('./commands/antilink');
const { handleAntitagCommand, handleTagDetection } = require('./commands/antitag');
const { Antilink } = require('./lib/antilink');
const { handleMentionDetection, mentionToggleCommand, setMentionCommand } = require('./commands/mention');
const memeCommand = require('./commands/meme');
const tagCommand = require('./commands/tag');
const tagNotAdminCommand = require('./commands/tagnotadmin');
const hideTagCommand = require('./commands/hidetag');
const jokeCommand = require('./commands/joke');
const quoteCommand = require('./commands/quote');
const factCommand = require('./commands/fact');
const weatherCommand = require('./commands/weather');
const newsCommand = require('./commands/news');
const kickCommand = require('./commands/kick');
const simageCommand = require('./commands/simage');
const attpCommand = require('./commands/attp');
const { startHangman, guessLetter } = require('./commands/hangman');
const { startTrivia, answerTrivia } = require('./commands/trivia');
const { complimentCommand } = require('./commands/compliment');
const { insultCommand } = require('./commands/insult');
const { eightBallCommand } = require('./commands/eightball');
const { lyricsCommand } = require('./commands/lyrics');
const { dareCommand } = require('./commands/dare');
const { truthCommand } = require('./commands/truth');
const { clearCommand } = require('./commands/clear');
const pingCommand = require('./commands/ping');
const aliveCommand = require('./commands/alive');
const blurCommand = require('./commands/img-blur');
const { welcomeCommand, handleJoinEvent } = require('./commands/welcome');
const { goodbyeCommand, handleLeaveEvent } = require('./commands/goodbye');
const githubCommand = require('./commands/github');
const { handleAntiBadwordCommand, handleBadwordDetection } = require('./lib/antibadword');
const antibadwordCommand = require('./commands/antibadword');
const { handleChatbotCommand, handleChatbotResponse } = require('./commands/chatbot');
const takeCommand = require('./commands/take');
const { flirtCommand } = require('./commands/flirt');
const characterCommand = require('./commands/character');
const wastedCommand = require('./commands/wasted');
const shipCommand = require('./commands/ship');
const groupInfoCommand = require('./commands/groupinfo');
const resetlinkCommand = require('./commands/resetlink');
const staffCommand = require('./commands/staff');
const unbanCommand = require('./commands/unban');
const emojimixCommand = require('./commands/emojimix');
const { handlePromotionEvent } = require('./commands/promote');
const { handleDemotionEvent } = require('./commands/demote');
const viewOnceCommand = require('./commands/viewonce');
const clearSessionCommand = require('./commands/clearsession');
const { autoStatusCommand, handleStatusUpdate } = require('./commands/autostatus');
const { simpCommand } = require('./commands/simp');
const { stupidCommand } = require('./commands/stupid');
const stickerTelegramCommand = require('./commands/stickertelegram');
const textmakerCommand = require('./commands/textmaker');
const { handleAntideleteCommand, handleMessageRevocation, storeMessage } = require('./commands/antidelete');
const clearTmpCommand = require('./commands/cleartmp');
const setProfilePicture = require('./commands/setpp');
const { setGroupDescription, setGroupName, setGroupPhoto } = require('./commands/groupmanage');
const instagramCommand = require('./commands/instagram');
const facebookCommand = require('./commands/facebook');
const spotifyCommand = require('./commands/spotify');
const playCommand = require('./commands/play');
const tiktokCommand = require('./commands/tiktok');
const songCommand = require('./commands/song');
const aiCommand = require('./commands/ai');
const urlCommand = require('./commands/url');
const { handleTranslateCommand } = require('./commands/translate');
const { handleSsCommand } = require('./commands/ss');
const { addCommandReaction, handleAreactCommand } = require('./lib/reactions');
const { goodnightCommand } = require('./commands/goodnight');
const { shayariCommand } = require('./commands/shayari');
const { rosedayCommand } = require('./commands/roseday');
const imagineCommand = require('./commands/imagine');
const videoCommand = require('./commands/video');
const sudoCommand = require('./commands/sudo');
const { miscCommand, handleHeart } = require('./commands/misc');
const { animeCommand } = require('./commands/anime');
const { piesCommand, piesAlias } = require('./commands/pies');
const stickercropCommand = require('./commands/stickercrop');
const updateCommand = require('./commands/update');
const removebgCommand = require('./commands/removebg');
const { reminiCommand } = require('./commands/remini');
const { igsCommand } = require('./commands/igs');
const { anticallCommand, readState: readAnticallState } = require('./commands/anticall');
const { pmblockerCommand, readState: readPmBlockerState } = require('./commands/pmblocker');
const settingsCommand = require('./commands/settings');
const soraCommand = require('./commands/sora');
const { antibotCommand, isAntibotEnabled } = require('./commands/antibot');

// ─── ITACHI-XMD v2.0 — Nouvelles commandes ───────────────
const closeCommand = require('./commands/close');
const openCommand = require('./commands/open');
const autoviewstatusCommand = require('./commands/autoviewstatus');
const allmenuCommand = require('./commands/allmenu');
const imageCommand = require('./commands/image');
const antileaveCommand = require('./commands/antileave');
const { handleAntileave } = require('./commands/antileave');
const antimentionstatusCmd = require('./commands/antimentionstatus');
const { isStatusMention, isEnabled: isAntiStatusMentionEnabled, handleAntimentionStatus } = require('./commands/antimentionstatus');
const antimentionCommand = require('./commands/antimention');
const { handleAntimention } = require('./commands/antimention');
const linkCommand = require('./commands/link');
const menustyleCommand = require('./commands/menustyle');
const themeCommand = require('./commands/theme');
const setmenuimageCommand = require('./commands/setmenuimage');
const pairCommand = require('./commands/pair');
const promptCommand = require('./commands/prompt');
const { getPrompt } = require('./commands/prompt');
const autoreactstatusCommand = require('./commands/autoreactstatus');
const { handleAutoReact } = require('./commands/autoreactstatus');
const uptimeCommand = require('./commands/uptime');
const saveCommand = require('./commands/save');
const toimageCommand = require('./commands/toimage');
const antistickerCommand = require('./commands/antisticker');
const { handleAntisticker } = require('./commands/antisticker');
const setsudoCommand = require('./commands/setsudo');
const listsudoCommand = require('./commands/listsudo');
const delsudoCommand = require('./commands/delsudo');
const codeaiCommand = require('./commands/codeai');
const gjidCommand = require('./commands/gjid');
const gstatusCommand = require('./commands/gstatus');
const hummCommand = require('./commands/humm');
const selfCommand = require('./commands/self');
const { isSelfMode } = require('./commands/self');
// ─────────────────────────────────────────────────────────

// ─── ITACHI-XMD v2.0 — Nouvelles commandes supplémentaires ───
const { dlStatusCommand, lectureStatusCommand, likeStatusCommand, sendMeCommand } = require('./commands/statuts');
const { pollCommand, gcreateCommand, joinCommand, leaveCommand, lockCommand, unlockCommand, kickallCommand: kickallGroupCmd, vcfCommand, tagadminCommand, acceptallCommand, rejectallCommand } = require('./commands/groupeplus');
const { getprivacyCommand, lastseenCommand, onlineCommand, presenceCommand, setbioCommand, myppCommand, mystatusCommand, groupaddCommand, readCommand } = require('./commands/confidentialite');
const { kickallCommand, purgeCommand, antipurgeCommand, sanctionCommand, uptimeCmdNew, testCmdNew, infoCmdNew, contactCmdNew, autorecordingCommand, restoreCommand, clanCommand, loiCommand, antimaraboutCommand, handleAntimarabout } = require('./commands/nouvelles');
// ──────────────────────────────────────────────────────────────

// Global settings
global.packname = settings.packname;
global.author = settings.author;
global.channelLink = "https://whatsapp.com/channel/0029VbC8YkY7oQhiOiiSpy1z";
global.ytch = "";

// Add this near the top of main.js with other global configurations
const channelInfo = {
    contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363408304719268@newsletter',
            newsletterName: 'ITACHI-XMD',
            serverMessageId: -1
        }
    }
};

async function handleMessages(sock, messageUpdate, printLog) {
    try {
        const { messages, type } = messageUpdate;
        if (type !== 'notify') return;

        const message = messages[0];
        if (!message?.message) return;

        // Handle autoread functionality
        await handleAutoread(sock, message);

        // Store message for antidelete feature
        if (message.message) {
            storeMessage(sock, message);
        }

        // Handle message revocation
        if (message.message?.protocolMessage?.type === 0) {
            await handleMessageRevocation(sock, message);
            return;
        }

        const chatId = message.key.remoteJid;
        const senderId = message.key.participant || message.key.remoteJid;
        const isGroup = chatId.endsWith('@g.us');
        const isChannel = chatId.endsWith('@newsletter');

        // ── Support des chaînes WhatsApp ──
        // Dans une chaîne, seul le proprio peut écrire → fromMe = true
        // On traite les chaînes comme des chats privés du proprio
        const senderIsSudo = await isSudo(senderId);
        const senderIsOwnerOrSudo = await isOwnerOrSudo(senderId, sock, chatId);

        // Vérification antibot : bloquer les autres bots dans le groupe
        if (isGroup && isAntibotEnabled(chatId)) {
            const isBot = senderId.includes(':') && senderId.includes('@s.whatsapp.net') && !message.key.fromMe && !senderIsOwnerOrSudo;
            if (isBot) return; // Ignorer silencieusement les messages des autres bots
        }

        // Handle button responses
        if (message.message?.buttonsResponseMessage) {
            const buttonId = message.message.buttonsResponseMessage.selectedButtonId;
            const chatId = message.key.remoteJid;

            if (buttonId === 'channel') {
                await sock.sendMessage(chatId, {
                    text: '📢 *Join our Channel:*\nhttps://whatsapp.com/channel/0029VbC8YkY7oQhiOiiSpy1z'
                }, { quoted: message });
                return;
            } else if (buttonId === 'owner') {
                const ownerCommand = require('./commands/owner');
                await ownerCommand(sock, chatId);
                return;
            } else if (buttonId === 'support') {
                await sock.sendMessage(chatId, {
                    text: `🔗 *Support*\n\nhttps://chat.whatsapp.com/Kipqc4A7lt4E7GCd112HvG?mode=gi_t`
                }, { quoted: message });
                return;
            }
        }

        // Extraction du texte — supporte groupes, MP et chaînes WhatsApp
        // Dans les chaînes, le message peut être wrappé dans messageContextInfo
        const msgContent = message.message?.messageContextInfo
            ? Object.values(message.message).find(v => v?.conversation || v?.text || v?.caption)
            : message.message;

        const rawText = (
            message.message?.conversation?.trim() ||
            message.message?.extendedTextMessage?.text?.trim() ||
            message.message?.imageMessage?.caption?.trim() ||
            message.message?.videoMessage?.caption?.trim() ||
            msgContent?.conversation?.trim() ||
            msgContent?.extendedTextMessage?.text?.trim() ||
            ''
        );

        // ── Détection du préfixe dynamique ──────────────────
        const allPrefixes = VALID_PREFIXES;
        const rawUserMessage = rawText.toLowerCase().replace(/\.\s+/g, '.').trim();
        
        // Trouver quel préfixe est utilisé dans ce message
        let usedPrefix = null;
        for (const p of allPrefixes) {
            if (rawUserMessage.startsWith(p.toLowerCase())) {
                usedPrefix = p.toLowerCase();
                break;
            }
        }
        
        // ✅ NORMALISATION : convertir le préfixe utilisé en '.' pour que toutes les commandes matchent
        // Ex: "Ibmenu" → ".menu", "⚡ping" → ".ping", "!kick" → ".kick"
        let userMessage;
        if (usedPrefix && usedPrefix !== '.') {
            userMessage = '.' + rawUserMessage.slice(usedPrefix.length);
        } else {
            userMessage = rawUserMessage;
        }
        
        const hasPrefix = usedPrefix !== null;

        // Only log command usage
        if (hasPrefix) {
            console.log(`📝 Command used in ${isGroup ? 'group' : 'private'}: ${userMessage}`);
        }
        // Read bot mode once; don't early-return so moderation can still run in private mode
        let isPublic = true;
        try {
            const data = JSON.parse(fs.readFileSync('./data/messageCount.json'));
            if (typeof data.isPublic === 'boolean') isPublic = data.isPublic;
        } catch (error) {
            console.error('Error checking access mode:', error);
            // default isPublic=true on error
        }
        const isOwnerOrSudoCheck = message.key.fromMe || senderIsOwnerOrSudo;

        // Dans une chaîne WhatsApp, bypass toutes les vérifications
        if (isChannel) {
            if (!hasPrefix) return; // Ignorer les posts normaux
            // Forcer isPublic et owner pour les chaînes
            isPublic = true;
        }

        // ── Self mode : seul le proprio/sudo peut utiliser le bot ──
        try {
            if (isSelfMode() && !isOwnerOrSudoCheck && hasPrefix) return;
        } catch (e) { /* non critique */ }

        // ── Anti-statut mention ──
        try {
            if (isAntiStatusMentionEnabled() && isStatusMention(message) && !isOwnerOrSudoCheck) return;
        } catch (e) { /* non critique */ }

        // Check if user is banned (skip ban check for unban command)
        if (isBanned(senderId) && !userMessage.startsWith('.unban')) {
            // Only respond occasionally to avoid spam
            if (Math.random() < 0.1) {
                await sock.sendMessage(chatId, {
                    text: '❌ You are banned from using the bot. Contact an admin to get unbanned.',
                    ...channelInfo
                });
            }
            return;
        }

        // First check if it's a game move
        if (/^[1-9]$/.test(userMessage) || userMessage.toLowerCase() === 'surrender') {
            await handleTicTacToeMove(sock, chatId, senderId, userMessage);
            return;
        }

        /*  // Basic message response in private chat
          if (!isGroup && (userMessage === 'hi' || userMessage === 'hello' || userMessage === 'bot' || userMessage === 'hlo' || userMessage === 'hey' || userMessage === 'bro')) {
              await sock.sendMessage(chatId, {
                  text: 'Hi, How can I help you?\nYou can use .menu for more info and commands.',
                  ...channelInfo
              });
              return;
          } */

        if (!message.key.fromMe) incrementMessageCount(chatId, senderId);

        // Check for bad words and antilink FIRST, before ANY other processing
        // Always run moderation in groups, regardless of mode
        if (isGroup) {
            if (userMessage) {
                await handleBadwordDetection(sock, chatId, message, userMessage, senderId);
            }
            // Antilink checks message text internally, so run it even if userMessage is empty
            await Antilink(message, sock);

            // ── Anti-sticker ──
            try {
                if (message.message?.stickerMessage) {
                    const blocked = await handleAntisticker(sock, chatId, senderId, message);
                    if (blocked) return;
                }
            } catch (e) { /* non critique */ }

            // ── Anti-mention ──
            try {
                const mentionedJids = (message.message?.extendedTextMessage?.contextInfo?.mentionedJid) || [];
                if (Array.isArray(mentionedJids) && mentionedJids.length > 0) {
                    const blocked = await handleAntimention(sock, chatId, senderId, mentionedJids, message);
                    if (blocked) return;
                }
            } catch (e) { /* non critique */ }

            // ── Anti-statut mention : supprimer les réponses aux statuts ──
            try {
                const deleted = await handleAntimentionStatus(sock, chatId, senderId, message);
                if (deleted) return;
            } catch (e) { /* non critique */ }
        }

        // PM blocker: block non-owner DMs when activé (do not ban)
        // Ne pas bloquer les chaînes WhatsApp
        if (!isGroup && !isChannel && !message.key.fromMe && !senderIsSudo) {
            try {
                const pmState = readPmBlockerState();
                if (pmState.activé) {
                    // Inform user, delay, then block without banning globally
                    await sock.sendMessage(chatId, { text: pmState.message || 'Private messages are blocked. Please contact the owner in groups only.' });
                    await new Promise(r => setTimeout(r, 1500));
                    try { await sock.updateBlockStatus(chatId, 'block'); } catch (e) { }
                    return;
                }
            } catch (e) { }
        }

        // Then check for command prefix — Préfixe dynamique

        if (!hasPrefix) {
            // Show typing indicator if autotyping is activé
            await handleAutotypingForMessage(sock, chatId, userMessage);

            if (isGroup) {
                // ── Anti-statut mention sur messages sans préfixe ──
                try {
                    const deleted = await handleAntimentionStatus(sock, chatId, senderId, message);
                    if (deleted) return;
                } catch (e) { /* non critique */ }

                // Always run moderation features (antitag) regardless of mode
                await handleTagDetection(sock, chatId, message, senderId);
                await handleMentionDetection(sock, chatId, message);

                // Chatbot : répond SEULEMENT si activé dans ce groupe via .chatbot on
                if (isPublic || isOwnerOrSudoCheck) {
                    // Vérifie si le chatbot est activé pour ce groupe spécifiquement
                    try {
                        const fs = require('fs');
                        const path = require('path');
                        const ugd = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/userGroupData.json')));
                        if (ugd.chatbot && ugd.chatbot[chatId]) {
                            await handleChatbotResponse(sock, chatId, message, userMessage, senderId);
                        }
                    } catch (e) { /* chatbot non activé */ }
                }
            }
            return;
        }
        // In private mode, only owner/sudo can run commands
        // Les chaînes sont toujours autorisées
        if (!isPublic && !isOwnerOrSudoCheck && !isChannel) {
            return;
        }

        // List of admin commands
        const adminCommands = []; // Toutes les commandes sont publiques
        const isAdminCommand = adminCommands.some(cmd => userMessage.startsWith(cmd));

        // List of owner commands
        const ownerCommands = []; // Plus de restriction propriétaire sur les commandes
        const isOwnerCommand = ownerCommands.some(cmd => userMessage.startsWith(cmd));

        let isSenderAdmin = false;
        let isBotAdmin = false;

        // Check admin status only for admin commands in groups
        if (isGroup && isAdminCommand) {
            // Si c'est le propriétaire (fromMe ou ownerOrSudo), on bypass toutes les vérifications
            if (message.key.fromMe || senderIsOwnerOrSudo) {
                isSenderAdmin = true;
                isBotAdmin = true;
            } else {
                const adminStatus = await isAdmin(sock, chatId, senderId);
                isSenderAdmin = adminStatus.isSenderAdmin;
                isBotAdmin = adminStatus.isBotAdmin;

                if (!isBotAdmin) {
                    await sock.sendMessage(chatId, { text: `Le bot doit etre admin pour cette commande.`, ...channelInfo }, { quoted: message });
                    return;
                }

                if (
                    userMessage.startsWith('.mute') ||
                    userMessage === '.unmute' ||
                    userMessage.startsWith('.ban') ||
                    userMessage.startsWith('.unban') ||
                    userMessage.startsWith('.promote') ||
                    userMessage.startsWith('.demote')
                ) {
                    if (!isSenderAdmin) {
                        await sock.sendMessage(chatId, {
                            text: 'Seuls les admins peuvent utiliser cette commande.',
                            ...channelInfo
                        }, { quoted: message });
                        return;
                    }
                }
            }
        }

        // Check owner status for owner commands
        if (isOwnerCommand) {
            if (!message.key.fromMe && !senderIsOwnerOrSudo) {
                await sock.sendMessage(chatId, { text: '❌ Cette commande est réservée au propriétaire !' }, { quoted: message });
                return;
            }
        }

        // Command handlers - Execute commands immediately without waiting for typing indicator
        // We'll show typing indicator after command execution if needed
        let commandExecuted = false;

        switch (true) {
            case userMessage === '.simage': {
                const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
                if (quotedMessage?.stickerMessage) {
                    await simageCommand(sock, quotedMessage, chatId);
                } else {
                    await sock.sendMessage(chatId, { text: 'Please reply to a sticker with the .simage command to convert it.', ...channelInfo }, { quoted: message });
                }
                commandExecuted = true;
                break;
            }
            case userMessage.startsWith('.kick'):
                const mentionedJidListKick = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await kickCommand(sock, chatId, senderId, mentionedJidListKick, message);
                break;
            case userMessage.startsWith('.mute'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const muteArg = parts[1];
                    const muteDuration = muteArg !== undefined ? parseInt(muteArg, 10) : undefined;
                    if (muteArg !== undefined && (isNaN(muteDuration) || muteDuration <= 0)) {
                        await sock.sendMessage(chatId, { text: 'Please provide a valid number of minutes or use .mute with no number to mute immediately.', ...channelInfo }, { quoted: message });
                    } else {
                        await muteCommand(sock, chatId, senderId, message, muteDuration);
                    }
                }
                break;
            case userMessage === '.unmute':
                await unmuteCommand(sock, chatId, senderId);
                break;
            case userMessage.startsWith('.ban'):
                if (!isGroup) {
                    if (!message.key.fromMe && !senderIsSudo) {
                        await sock.sendMessage(chatId, { text: 'Only owner/sudo can use .ban in private chat.' }, { quoted: message });
                        break;
                    }
                }
                await banCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.unban'):
                if (!isGroup) {
                    if (!message.key.fromMe && !senderIsSudo) {
                        await sock.sendMessage(chatId, { text: 'Only owner/sudo can use .unban in private chat.' }, { quoted: message });
                        break;
                    }
                }
                await unbanCommand(sock, chatId, message);
                break;
            case userMessage === '.help' || userMessage === '.menu' || userMessage === '.bot' || userMessage === '.list':
                await helpCommand(sock, chatId, message, global.channelLink);
                commandExecuted = true;
                break;
            case userMessage === '.sticker' || userMessage === '.s':
                await stickerCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case userMessage.startsWith('.warnings'):
                const mentionedJidListWarnings = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await warningsCommand(sock, chatId, mentionedJidListWarnings);
                break;
            case userMessage.startsWith('.warn'):
                const mentionedJidListWarn = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await warnCommand(sock, chatId, senderId, mentionedJidListWarn, message);
                break;
            case userMessage.startsWith('.tts'):
                const text = userMessage.slice(4).trim();
                await ttsCommand(sock, chatId, text, message);
                break;
            case userMessage.startsWith('.delete') || userMessage.startsWith('.del'):
                await deleteCommand(sock, chatId, message, senderId);
                break;
            case userMessage.startsWith('.attp'):
                await attpCommand(sock, chatId, message);
                break;

            case userMessage === '.setprefix' ||
                 userMessage.startsWith('.setprefix ') ||
                 userMessage === '!setprefix' || userMessage.startsWith('!setprefix ') ||
                 userMessage === '/setprefix' || userMessage.startsWith('/setprefix ') ||
                 userMessage === '?setprefix' || userMessage.startsWith('?setprefix ') ||
                 userMessage === '%setprefix' || userMessage.startsWith('%setprefix ') ||
                 userMessage === '*setprefix' || userMessage.startsWith('*setprefix ') ||
                 userMessage.includes('setprefix'): {
                const pfArgs = rawText.trim().split(' ').slice(1);
                await setprefixCommand(sock, chatId, pfArgs, message);
                break;
            }

            case userMessage === '.settings':
                await settingsCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.mode'):
                // Check if sender is the owner
                if (!message.key.fromMe && !senderIsOwnerOrSudo) {
                    await sock.sendMessage(chatId, { text: 'Only bot owner can use this command!', ...channelInfo }, { quoted: message });
                    return;
                }
                // Read current data first
                let data;
                try {
                    data = JSON.parse(fs.readFileSync('./data/messageCount.json'));
                } catch (error) {
                    console.error('Error reading access mode:', error);
                    await sock.sendMessage(chatId, { text: 'Failed to read bot mode status', ...channelInfo });
                    return;
                }

                const action = userMessage.split(' ')[1]?.toLowerCase();
                // If no argument provided, show current status
                if (!action) {
                    const currentMode = data.isPublic ? 'public' : 'private';
                    await sock.sendMessage(chatId, {
                        text: `Current bot mode: *${currentMode}*\n\nUsage: .mode public/private\n\nExample:\n.mode public - Allow everyone to use bot\n.mode private - Restrict to owner only`,
                        ...channelInfo
                    }, { quoted: message });
                    return;
                }

                if (action !== 'public' && action !== 'private') {
                    await sock.sendMessage(chatId, {
                        text: 'Usage: .mode public/private\n\nExample:\n.mode public - Allow everyone to use bot\n.mode private - Restrict to owner only',
                        ...channelInfo
                    }, { quoted: message });
                    return;
                }

                try {
                    // Update access mode
                    data.isPublic = action === 'public';

                    // Save updated data
                    fs.writeFileSync('./data/messageCount.json', JSON.stringify(data, null, 2));

                    await sock.sendMessage(chatId, { text: `Bot is now in *${action}* mode`, ...channelInfo });
                } catch (error) {
                    console.error('Error updating access mode:', error);
                    await sock.sendMessage(chatId, { text: 'Failed to update bot access mode', ...channelInfo });
                }
                break;
            case userMessage.startsWith('.anticall'):
                if (!message.key.fromMe && !senderIsOwnerOrSudo) {
                    await sock.sendMessage(chatId, { text: 'Only owner/sudo can use anticall.' }, { quoted: message });
                    break;
                }
                {
                    const args = userMessage.split(' ').slice(1).join(' ');
                    await anticallCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.pmblocker'):
                {
                    const args = userMessage.split(' ').slice(1).join(' ');
                    await pmblockerCommand(sock, chatId, message, args);
                }
                commandExecuted = true;
                break;
            case userMessage === '.owner':
                await ownerCommand(sock, chatId);
                break;
            case userMessage === '.tagall':
                await tagAllCommand(sock, chatId, senderId, message);
                break;
            case userMessage === '.tagnotadmin':
                await tagNotAdminCommand(sock, chatId, senderId, message);
                break;
            case userMessage.startsWith('.hidetag'):
                {
                    const messageText = rawText.slice(8).trim();
                    const replyMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage || null;
                    await hideTagCommand(sock, chatId, senderId, messageText, replyMessage, message);
                }
                break;
            case userMessage.startsWith('.tag'):
                const messageText = rawText.slice(4).trim();  // use rawText here, not userMessage
                const replyMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage || null;
                await tagCommand(sock, chatId, senderId, messageText, replyMessage, message);
                break;
            case userMessage.startsWith('.antilink'):
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups.', ...channelInfo }, { quoted: message });
                    return;
                }
                await handleAntilinkCommand(sock, chatId, userMessage, senderId, isSenderAdmin, message);
                break;
            case userMessage.startsWith('.antitag'):
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups.', ...channelInfo }, { quoted: message });
                    return;
                }
                await handleAntitagCommand(sock, chatId, userMessage, senderId, isSenderAdmin, message);
                break;
            case userMessage === '.meme':
                await memeCommand(sock, chatId, message);
                break;
            case userMessage === '.joke':
                await jokeCommand(sock, chatId, message);
                break;
            case userMessage === '.quote':
                await quoteCommand(sock, chatId, message);
                break;
            case userMessage === '.fact':
                await factCommand(sock, chatId, message, message);
                break;
            case userMessage.startsWith('.weather'):
                const city = userMessage.slice(9).trim();
                if (city) {
                    await weatherCommand(sock, chatId, message, city);
                } else {
                    await sock.sendMessage(chatId, { text: 'Please specify a city, e.g., .weather London', ...channelInfo }, { quoted: message });
                }
                break;
            case userMessage === '.news':
                await newsCommand(sock, chatId);
                break;
            case userMessage.startsWith('.ttt') || userMessage.startsWith('.tictactoe'):
                const tttText = userMessage.split(' ').slice(1).join(' ');
                await tictactoeCommand(sock, chatId, senderId, tttText);
                break;
            case userMessage.startsWith('.move'):
                const position = parseInt(userMessage.split(' ')[1]);
                if (isNaN(position)) {
                    await sock.sendMessage(chatId, { text: 'Please provide a valid position number for Tic-Tac-Toe move.', ...channelInfo }, { quoted: message });
                } else {
                    tictactoeMove(sock, chatId, senderId, position);
                }
                break;
            case userMessage === '.topmembers':
                topMembers(sock, chatId, isGroup);
                break;
            case userMessage.startsWith('.hangman'):
                startHangman(sock, chatId);
                break;
            case userMessage.startsWith('.guess'):
                const guessedLetter = userMessage.split(' ')[1];
                if (guessedLetter) {
                    guessLetter(sock, chatId, guessedLetter);
                } else {
                    sock.sendMessage(chatId, { text: 'Please guess a letter using .guess <letter>', ...channelInfo }, { quoted: message });
                }
                break;
            case userMessage.startsWith('.trivia'):
                startTrivia(sock, chatId);
                break;
            case userMessage.startsWith('.answer'):
                const answer = userMessage.split(' ').slice(1).join(' ');
                if (answer) {
                    answerTrivia(sock, chatId, answer);
                } else {
                    sock.sendMessage(chatId, { text: 'Please provide an answer using .answer <answer>', ...channelInfo }, { quoted: message });
                }
                break;
            case userMessage.startsWith('.compliment'):
                await complimentCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.insult'):
                await insultCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.8ball'):
                const question = userMessage.split(' ').slice(1).join(' ');
                await eightBallCommand(sock, chatId, question);
                break;
            case userMessage.startsWith('.lyrics'):
                const songTitle = userMessage.split(' ').slice(1).join(' ');
                await lyricsCommand(sock, chatId, songTitle, message);
                break;
            case userMessage.startsWith('.simp'):
                const quotedMsg = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
                const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await simpCommand(sock, chatId, quotedMsg, mentionedJid, senderId);
                break;
            case userMessage.startsWith('.stupid') || userMessage.startsWith('.itssostupid') || userMessage.startsWith('.iss'):
                const stupidQuotedMsg = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
                const stupidMentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
                const stupidArgs = userMessage.split(' ').slice(1);
                await stupidCommand(sock, chatId, stupidQuotedMsg, stupidMentionedJid, senderId, stupidArgs);
                break;
            case userMessage === '.dare':
                await dareCommand(sock, chatId, message);
                break;
            case userMessage === '.truth':
                await truthCommand(sock, chatId, message);
                break;
            case userMessage === '.clear':
                if (isGroup) await clearCommand(sock, chatId);
                break;
            case userMessage.startsWith('.promote'):
                const mentionedJidListPromote = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await promoteCommand(sock, chatId, mentionedJidListPromote, message);
                break;
            case userMessage.startsWith('.demote'):
                const mentionedJidListDemote = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await demoteCommand(sock, chatId, mentionedJidListDemote, message);
                break;
            case userMessage === '.ping':
                await pingCommand(sock, chatId, message);
                break;
            case userMessage === '.alive':
                await aliveCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.mention '):
                {
                    const args = userMessage.split(' ').slice(1).join(' ');
                    const isOwner = message.key.fromMe || senderIsSudo;
                    await mentionToggleCommand(sock, chatId, message, args, isOwner);
                }
                break;
            case userMessage === '.setmention':
                {
                    const isOwner = message.key.fromMe || senderIsSudo;
                    await setMentionCommand(sock, chatId, message, isOwner);
                }
                break;
            case userMessage.startsWith('.blur'):
                const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
                await blurCommand(sock, chatId, message, quotedMessage);
                break;
            case userMessage.startsWith('.welcome'):
                if (isGroup) {
                    // Check admin status if not already checked
                    if (!isSenderAdmin) {
                        const adminStatus = await isAdmin(sock, chatId, senderId);
                        isSenderAdmin = adminStatus.isSenderAdmin;
                    }

                    if (isSenderAdmin || message.key.fromMe) {
                        await welcomeCommand(sock, chatId, message);
                    } else {
                        await sock.sendMessage(chatId, { text: 'Seuls les admins peuvent utiliser cette commande.', ...channelInfo }, { quoted: message });
                    }
                } else {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups.', ...channelInfo }, { quoted: message });
                }
                break;
            case userMessage.startsWith('.goodbye'):
                if (isGroup) {
                    // Check admin status if not already checked
                    if (!isSenderAdmin) {
                        const adminStatus = await isAdmin(sock, chatId, senderId);
                        isSenderAdmin = adminStatus.isSenderAdmin;
                    }

                    if (isSenderAdmin || message.key.fromMe) {
                        await goodbyeCommand(sock, chatId, message);
                    } else {
                        await sock.sendMessage(chatId, { text: 'Seuls les admins peuvent utiliser cette commande.', ...channelInfo }, { quoted: message });
                    }
                } else {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups.', ...channelInfo }, { quoted: message });
                }
                break;
            case userMessage === '.git':
            case userMessage === '.github':
            case userMessage === '.sc':
            case userMessage === '.script':
            case userMessage === '.repo':
                await githubCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.antibot'): {
                const antibotArgs = userMessage.split(' ').slice(1);
                const adminStatus2 = await isAdmin(sock, chatId, senderId);
                await antibotCommand(sock, chatId, message, antibotArgs, adminStatus2.isSenderAdmin || message.key.fromMe || senderIsOwnerOrSudo);
                break;
            }
            case userMessage.startsWith('.antibadword'):
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups.', ...channelInfo }, { quoted: message });
                    return;
                }

                await antibadwordCommand(sock, chatId, message, senderId, true);
                break;
            case userMessage.startsWith('.chatbot'):
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups.', ...channelInfo }, { quoted: message });
                    return;
                }

                // Check if sender is admin or bot owner
                const chatbotAdminStatus = await isAdmin(sock, chatId, senderId);
                if (!chatbotAdminStatus.isSenderAdmin && !message.key.fromMe) {
                    await sock.sendMessage(chatId, { text: '*Only admins or bot owner can use this command*', ...channelInfo }, { quoted: message });
                    return;
                }

                const match = userMessage.slice(8).trim();
                await handleChatbotCommand(sock, chatId, message, match);
                break;
            case userMessage.startsWith('.take') || userMessage.startsWith('.steal'):
                {
                    const isSteal = userMessage.startsWith('.steal');
                    const sliceLen = isSteal ? 6 : 5; // '.steal' vs '.take'
                    const takeArgs = rawText.slice(sliceLen).trim().split(' ');
                    await takeCommand(sock, chatId, message, takeArgs);
                }
                break;
            case userMessage === '.flirt':
                await flirtCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.character'):
                await characterCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.waste'):
                await wastedCommand(sock, chatId, message);
                break;
            case userMessage === '.ship':
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups!', ...channelInfo }, { quoted: message });
                    return;
                }
                await shipCommand(sock, chatId, message);
                break;
            case userMessage === '.groupinfo' || userMessage === '.infogp' || userMessage === '.infogrupo':
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups!', ...channelInfo }, { quoted: message });
                    return;
                }
                await groupInfoCommand(sock, chatId, message);
                break;
            case userMessage === '.resetlink' || userMessage === '.revoke' || userMessage === '.anularlink':
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups!', ...channelInfo }, { quoted: message });
                    return;
                }
                await resetlinkCommand(sock, chatId, senderId);
                break;
            case userMessage === '.staff' || userMessage === '.admins' || userMessage === '.listadmin':
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups!', ...channelInfo }, { quoted: message });
                    return;
                }
                await staffCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.tourl') || userMessage.startsWith('.url'):
                await urlCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.emojimix') || userMessage.startsWith('.emix'):
                await emojimixCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.tg') || userMessage.startsWith('.stickertelegram') || userMessage.startsWith('.tgsticker') || userMessage.startsWith('.telesticker'):
                await stickerTelegramCommand(sock, chatId, message);
                break;

            case userMessage === '.🥷':
            case userMessage === '.humm': {
                const replyMsg = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
                await hummCommand(sock, chatId, senderId, replyMsg, message);
                break;
            }
                await viewOnceCommand(sock, chatId, message);
                break;
            case userMessage === '.clearsession' || userMessage === '.clearsesi':
                await clearSessionCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.autostatus'):
                const autoStatusArgs = userMessage.split(' ').slice(1);
                await autoStatusCommand(sock, chatId, message, autoStatusArgs);
                break;
            case userMessage.startsWith('.simp'):
                await simpCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.metallic'):
                await textmakerCommand(sock, chatId, message, userMessage, 'metallic');
                break;
            case userMessage.startsWith('.ice'):
                await textmakerCommand(sock, chatId, message, userMessage, 'ice');
                break;
            case userMessage.startsWith('.snow'):
                await textmakerCommand(sock, chatId, message, userMessage, 'snow');
                break;
            case userMessage.startsWith('.impressive'):
                await textmakerCommand(sock, chatId, message, userMessage, 'impressive');
                break;
            case userMessage.startsWith('.matrix'):
                await textmakerCommand(sock, chatId, message, userMessage, 'matrix');
                break;
            case userMessage.startsWith('.light'):
                await textmakerCommand(sock, chatId, message, userMessage, 'light');
                break;
            case userMessage.startsWith('.neon'):
                await textmakerCommand(sock, chatId, message, userMessage, 'neon');
                break;
            case userMessage.startsWith('.devil'):
                await textmakerCommand(sock, chatId, message, userMessage, 'devil');
                break;
            case userMessage.startsWith('.purple'):
                await textmakerCommand(sock, chatId, message, userMessage, 'purple');
                break;
            case userMessage.startsWith('.thunder'):
                await textmakerCommand(sock, chatId, message, userMessage, 'thunder');
                break;
            case userMessage.startsWith('.leaves'):
                await textmakerCommand(sock, chatId, message, userMessage, 'leaves');
                break;
            case userMessage.startsWith('.1917'):
                await textmakerCommand(sock, chatId, message, userMessage, '1917');
                break;
            case userMessage.startsWith('.arena'):
                await textmakerCommand(sock, chatId, message, userMessage, 'arena');
                break;
            case userMessage.startsWith('.hacker'):
                await textmakerCommand(sock, chatId, message, userMessage, 'hacker');
                break;
            case userMessage.startsWith('.sand'):
                await textmakerCommand(sock, chatId, message, userMessage, 'sand');
                break;
            case userMessage.startsWith('.blackpink'):
                await textmakerCommand(sock, chatId, message, userMessage, 'blackpink');
                break;
            case userMessage.startsWith('.glitch'):
                await textmakerCommand(sock, chatId, message, userMessage, 'glitch');
                break;
            case userMessage.startsWith('.fire'):
                await textmakerCommand(sock, chatId, message, userMessage, 'fire');
                break;
            case userMessage.startsWith('.antidelete'):
                const antideleteMatch = userMessage.slice(11).trim();
                await handleAntideleteCommand(sock, chatId, message, antideleteMatch);
                break;
            case userMessage === '.surrender':
                // Handle surrender command for tictactoe game
                await handleTicTacToeMove(sock, chatId, senderId, 'surrender');
                break;
            case userMessage === '.cleartmp':
                await clearTmpCommand(sock, chatId, message);
                break;
            case userMessage === '.setpp':
                await setProfilePicture(sock, chatId, message);
                break;
            case userMessage.startsWith('.setgdesc'):
                {
                    const text = rawText.slice(9).trim();
                    await setGroupDescription(sock, chatId, senderId, text, message);
                }
                break;
            case userMessage.startsWith('.setgname'):
                {
                    const text = rawText.slice(9).trim();
                    await setGroupName(sock, chatId, senderId, text, message);
                }
                break;
            case userMessage.startsWith('.setgpp'):
                await setGroupPhoto(sock, chatId, senderId, message);
                break;
            case userMessage.startsWith('.instagram') || userMessage.startsWith('.insta') || (userMessage === '.ig' || userMessage.startsWith('.ig ')):
                await instagramCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.igsc'):
                await igsCommand(sock, chatId, message, true);
                break;
            case userMessage.startsWith('.igs'):
                await igsCommand(sock, chatId, message, false);
                break;
            case userMessage.startsWith('.fb') || userMessage.startsWith('.facebook'):
                await facebookCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.music'):
                await playCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.spotify'):
                await spotifyCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.play') || userMessage.startsWith('.mp3') || userMessage.startsWith('.ytmp3') || userMessage.startsWith('.song'):
                await songCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.video') || userMessage.startsWith('.ytmp4'):
                await videoCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.tiktok') || userMessage.startsWith('.tt'):
                await tiktokCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.gpt') || userMessage.startsWith('.gemini'):
                await aiCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.translate') || userMessage.startsWith('.trt'):
                const commandLength = userMessage.startsWith('.translate') ? 10 : 4;
                await handleTranslateCommand(sock, chatId, message, userMessage.slice(commandLength));
                return;
            case userMessage.startsWith('.ss') || userMessage.startsWith('.ssweb') || userMessage.startsWith('.screenshot'):
                const ssCommandLength = userMessage.startsWith('.screenshot') ? 11 : (userMessage.startsWith('.ssweb') ? 6 : 3);
                await handleSsCommand(sock, chatId, message, userMessage.slice(ssCommandLength).trim());
                break;
            case userMessage.startsWith('.areact') || userMessage.startsWith('.autoreact') || userMessage.startsWith('.autoreaction'):
                await handleAreactCommand(sock, chatId, message, isOwnerOrSudoCheck);
                break;
            case userMessage.startsWith('.sudo'):
                await sudoCommand(sock, chatId, message);
                break;
            case userMessage === '.goodnight' || userMessage === '.lovenight' || userMessage === '.gn':
                await goodnightCommand(sock, chatId, message);
                break;
            case userMessage === '.shayari' || userMessage === '.shayri':
                await shayariCommand(sock, chatId, message);
                break;
            case userMessage === '.roseday':
                await rosedayCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.imagine') || userMessage.startsWith('.flux') || userMessage.startsWith('.dalle'): await imagineCommand(sock, chatId, message);
                break;
            case userMessage === '.jid': await groupJidCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.autotyping'):
                await autotypingCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case userMessage.startsWith('.autoread'):
                await autoreadCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case userMessage.startsWith('.heart'):
                await handleHeart(sock, chatId, message);
                break;
            case userMessage.startsWith('.horny'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['horny', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.circle'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['circle', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.lgbt'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['lgbt', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.lolice'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['lolice', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.simpcard'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['simpcard', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.tonikawa'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['tonikawa', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.its-so-stupid'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['its-so-stupid', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.namecard'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['namecard', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;

            case userMessage.startsWith('.oogway2'):
            case userMessage.startsWith('.oogway'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const sub = userMessage.startsWith('.oogway2') ? 'oogway2' : 'oogway';
                    const args = [sub, ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.tweet'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['tweet', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.ytcomment'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['youtube-comment', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.comrade'):
            case userMessage.startsWith('.gay'):
            case userMessage.startsWith('.glass'):
            case userMessage.startsWith('.jail'):
            case userMessage.startsWith('.passed'):
            case userMessage.startsWith('.triggered'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const sub = userMessage.slice(1).split(/\s+/)[0];
                    const args = [sub, ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.animu'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = parts.slice(1);
                    await animeCommand(sock, chatId, message, args);
                }
                break;
            // animu aliases
            case userMessage.startsWith('.nom'):
            case userMessage.startsWith('.poke'):
            case userMessage.startsWith('.cry'):
            case userMessage.startsWith('.kiss'):
            case userMessage.startsWith('.pat'):
            case userMessage.startsWith('.hug'):
            case userMessage.startsWith('.wink'):
            case userMessage.startsWith('.facepalm'):
            case userMessage.startsWith('.face-palm'):
            case userMessage.startsWith('.animuquote'):
            case userMessage.startsWith('.quote'):
            case userMessage.startsWith('.loli'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    let sub = parts[0].slice(1);
                    if (sub === 'facepalm') sub = 'face-palm';
                    if (sub === 'quote' || sub === 'animuquote') sub = 'quote';
                    await animeCommand(sock, chatId, message, [sub]);
                }
                break;
            case userMessage === '.crop':
                await stickercropCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case userMessage.startsWith('.pies'):
                {
                    const parts = rawText.trim().split(/\s+/);
                    const args = parts.slice(1);
                    await piesCommand(sock, chatId, message, args);
                    commandExecuted = true;
                }
                break;
            case userMessage === '.china':
                await piesAlias(sock, chatId, message, 'china');
                commandExecuted = true;
                break;
            case userMessage === '.indonesia':
                await piesAlias(sock, chatId, message, 'indonesia');
                commandExecuted = true;
                break;
            case userMessage === '.japan':
                await piesAlias(sock, chatId, message, 'japan');
                commandExecuted = true;
                break;
            case userMessage === '.korea':
                await piesAlias(sock, chatId, message, 'korea');
                commandExecuted = true;
                break;
            case userMessage === '.india':
                await piesAlias(sock, chatId, message, 'india');
                commandExecuted = true;
                break;
            case userMessage === '.malaysia':
                await piesAlias(sock, chatId, message, 'malaysia');
                commandExecuted = true;
                break;
            case userMessage === '.thailand':
                await piesAlias(sock, chatId, message, 'thailand');
                commandExecuted = true;
                break;
            case userMessage.startsWith('.update'):
                {
                    const parts = rawText.trim().split(/\s+/);
                    const zipArg = parts[1] && parts[1].startsWith('http') ? parts[1] : '';
                    await updateCommand(sock, chatId, message, zipArg);
                }
                commandExecuted = true;
                break;
            case userMessage.startsWith('.removebg') || userMessage.startsWith('.rmbg') || userMessage.startsWith('.nobg'):
                await removebgCommand.exec(sock, message, userMessage.split(' ').slice(1));
                break;
            case userMessage.startsWith('.remini') || userMessage.startsWith('.enhance') || userMessage.startsWith('.upscale'):
                await reminiCommand(sock, chatId, message, userMessage.split(' ').slice(1));
                break;
            case userMessage.startsWith('.sora'):
                await soraCommand(sock, chatId, message);
                break;

            // ══════════════════════════════════════════
            // 🥷 ITACHI-XMD v2.0 — Nouvelles commandes
            // ══════════════════════════════════════════

            case userMessage === '.close':
                await closeCommand(sock, chatId, senderId, message);
                break;

            case userMessage === '.open':
                await openCommand(sock, chatId, senderId, message);
                break;

            case userMessage.startsWith('.autoviewstatus'): {
                const avsArgs = userMessage.split(' ').slice(1);
                await autoviewstatusCommand(sock, chatId, senderId, avsArgs, message);
                break;
            }

            case userMessage === '.allmenu':
            case userMessage === '.allcmd':
                await allmenuCommand(sock, chatId, message);
                break;

            case userMessage.startsWith('.image'): {
                const imgArgs = rawText.split(' ').slice(1);
                await imageCommand(sock, chatId, imgArgs, message);
                break;
            }

            case userMessage.startsWith('.antileave'): {
                const alArgs = userMessage.split(' ').slice(1);
                await antileaveCommand(sock, chatId, senderId, alArgs, message);
                break;
            }

            case userMessage.startsWith('.antimentionstatus'):
            case userMessage.startsWith('.antistatusmention'): {
                const asmArgs = userMessage.split(' ').slice(1);
                await antimentionstatusCmd(sock, chatId, senderId, asmArgs, message);
                break;
            }

            case userMessage.startsWith('.antimention'): {
                const amArgs = userMessage.split(' ').slice(1);
                await antimentionCommand(sock, chatId, senderId, amArgs, message);
                break;
            }

            case userMessage.startsWith('.link'): {
                const linkArgs = userMessage.split(' ').slice(1);
                await linkCommand(sock, chatId, senderId, linkArgs, message);
                break;
            }

            case userMessage.startsWith('.menustyle'): {
                const msArgs = userMessage.split(' ').slice(1);
                await menustyleCommand(sock, chatId, senderId, msArgs, message);
                break;
            }

            case userMessage.startsWith('.theme'): {
                const thArgs = userMessage.split(' ').slice(1);
                await themeCommand(sock, chatId, thArgs, message);
                break;
            }

            case userMessage.startsWith('.setmenuimage'): {
                const smiArgs = userMessage.split(' ').slice(1);
                const smiReply = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
                await setmenuimageCommand(sock, chatId, senderId, smiArgs, smiReply, message);
                break;
            }

            case userMessage.startsWith('.pair'): {
                const pairArgs = userMessage.split(' ').slice(1);
                await pairCommand(sock, chatId, message, pairArgs);
                break;
            }

            case userMessage.startsWith('.prompt'): {
                const prArgs = rawText.split(' ').slice(1);
                await promptCommand(sock, chatId, senderId, prArgs, message);
                break;
            }

            case userMessage.startsWith('.autoreactstatus'): {
                const arsArgs = userMessage.split(' ').slice(1);
                await autoreactstatusCommand(sock, chatId, senderId, arsArgs, message);
                break;
            }

            case userMessage === '.uptime':
                await uptimeCmdNew(sock, chatId, message);
                break;

            case userMessage === '.save': {
                const saveReply = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
                await saveCommand(sock, chatId, senderId, saveReply, message);
                break;
            }

            case userMessage === '.toimage': {
                const toImgReply = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
                await toimageCommand(sock, chatId, toImgReply, message);
                break;
            }

            case userMessage.startsWith('.antisticker'): {
                const asArgs = userMessage.split(' ').slice(1);
                await antistickerCommand(sock, chatId, senderId, asArgs, message);
                break;
            }

            case userMessage.startsWith('.setsudo'): {
                const ssReply = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
                const ssArgs = userMessage.split(' ').slice(1);
                await setsudoCommand(sock, chatId, senderId, ssArgs, ssReply, message);
                break;
            }

            case userMessage === '.listsudo':
                await listsudoCommand(sock, chatId, senderId, message);
                break;

            case userMessage.startsWith('.delsudo'): {
                const dsReply = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
                const dsArgs = userMessage.split(' ').slice(1);
                await delsudoCommand(sock, chatId, senderId, dsArgs, dsReply, message);
                break;
            }

            case userMessage.startsWith('.codeai'): {
                const caiArgs = rawText.split(' ').slice(1);
                await codeaiCommand(sock, chatId, senderId, caiArgs, message);
                break;
            }

            case userMessage === '.gjid':
                await gjidCommand(sock, chatId, message);
                break;

            case userMessage.startsWith('.gstatus'): {
                const gsArgs = rawText.split(' ').slice(1);
                await gstatusCommand(sock, chatId, senderId, gsArgs, message);
                break;
            }

            case userMessage.startsWith('.self'): {
                const selfArgs = userMessage.split(' ').slice(1);
                await selfCommand(sock, chatId, senderId, selfArgs, message);
                break;
            }

            // ══════════════════════════════════════════
            // 🥷 Commandes nouvelles v2.0
            // ══════════════════════════════════════════

            // Nouvelles commandes
            case userMessage === '.kickall':
                await kickallCommand(sock, chatId, senderId, message);
                break;
            case userMessage.startsWith('.purge'): {
                const purgeArgs = userMessage.split(' ').slice(1);
                await purgeCommand(sock, chatId, senderId, purgeArgs, message);
                break;
            }
            case userMessage.startsWith('.antipurge'): {
                const apArgs2 = userMessage.split(' ').slice(1);
                await antipurgeCommand(sock, chatId, senderId, apArgs2, message);
                break;
            }
            case userMessage.startsWith('.sanction'): {
                const sanctArgs = rawText.split(' ').slice(1);
                await sanctionCommand(sock, chatId, senderId, sanctArgs, message);
                break;
            }
            case userMessage === '.uptime':
                await uptimeCmdNew(sock, chatId, message);
                break;
            case userMessage === '.test':
                await testCmdNew(sock, chatId, message);
                break;
            case userMessage === '.info':
                await infoCmdNew(sock, chatId, message);
                break;
            case userMessage === '.contact':
                await contactCmdNew(sock, chatId, message);
                break;
            case userMessage.startsWith('.autorecording'): {
                const arArgs = userMessage.split(' ').slice(1);
                await autorecordingCommand(sock, chatId, senderId, arArgs, message);
                break;
            }
            case userMessage === '.restore':
                await restoreCommand(sock, chatId, senderId, message);
                break;
            case userMessage.startsWith('.clan'): {
                const clanArgs = rawText.split(' ').slice(1);
                await clanCommand(sock, chatId, senderId, clanArgs, message);
                break;
            }
            case userMessage === '.loi':
                await loiCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.antimarabout'): {
                const amArgs = userMessage.split(' ').slice(1);
                await antimaraboutCommand(sock, chatId, senderId, amArgs, message);
                break;
            }

            // Statuts
            case userMessage.startsWith('.dl_status'):
            case userMessage.startsWith('.dlstatus'): {
                const dlReply = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
                await dlStatusCommand(sock, chatId, senderId, dlReply, message);
                break;
            }
            case userMessage === '.lecture_status':
            case userMessage === '.lecturestatus':
                await lectureStatusCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.likestatus'): {
                const lsArgs = rawText.split(' ').slice(1);
                const lsReply = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
                await likeStatusCommand(sock, chatId, senderId, lsArgs, lsReply, message);
                break;
            }
            case userMessage.startsWith('.sendme'): {
                const smArgs = rawText.split(' ').slice(1);
                const smReply = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
                await sendMeCommand(sock, chatId, senderId, smArgs, smReply, message);
                break;
            }

            // Groupe+
            case userMessage.startsWith('.poll'): {
                const pArgs = rawText.split(' ').slice(1);
                await pollCommand(sock, chatId, pArgs, message);
                break;
            }
            case userMessage.startsWith('.gcreate'): {
                const gcArgs = rawText.split(' ').slice(1);
                await gcreateCommand(sock, chatId, senderId, gcArgs, message);
                break;
            }
            case userMessage.startsWith('.join'): {
                const jArgs = userMessage.split(' ').slice(1);
                await joinCommand(sock, chatId, jArgs, message);
                break;
            }
            case userMessage === '.leave':
                await leaveCommand(sock, chatId, message);
                break;
            case userMessage === '.lock':
                await lockCommand(sock, chatId, message);
                break;
            case userMessage === '.unlock':
                await unlockCommand(sock, chatId, message);
                break;
            case userMessage === '.kickall':
                await kickallCommand(sock, chatId, message);
                break;
            case userMessage === '.vcf': {
                const vcfReply = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
                await vcfCommand(sock, chatId, senderId, vcfReply, message);
                break;
            }
            case userMessage.startsWith('.tagadmin'): {
                const taArgs = rawText.split(' ').slice(1);
                await tagadminCommand(sock, chatId, taArgs, message);
                break;
            }
            case userMessage === '.acceptall':
                await acceptallCommand(sock, chatId, message);
                break;
            case userMessage === '.rejectall':
                await rejectallCommand(sock, chatId, message);
                break;

            // Confidentialité
            case userMessage === '.getprivacy':
                await getprivacyCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.lastseen'): {
                const lsvArgs = userMessage.split(' ').slice(1);
                await lastseenCommand(sock, chatId, lsvArgs, message);
                break;
            }
            case userMessage.startsWith('.online'): {
                const olArgs = userMessage.split(' ').slice(1);
                await onlineCommand(sock, chatId, olArgs, message);
                break;
            }
            case userMessage.startsWith('.presence'): {
                const prArgs = userMessage.split(' ').slice(1);
                await presenceCommand(sock, chatId, prArgs, message);
                break;
            }
            case userMessage.startsWith('.setbio'): {
                const sbArgs = rawText.split(' ').slice(1);
                await setbioCommand(sock, chatId, sbArgs, message);
                break;
            }
            case userMessage === '.mypp':
                await myppCommand(sock, chatId, message);
                break;
            case userMessage === '.mystatus':
                await mystatusCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.groupadd'): {
                const gaArgs = userMessage.split(' ').slice(1);
                await groupaddCommand(sock, chatId, gaArgs, message);
                break;
            }
            case userMessage === '.read':
                await readCommand(sock, chatId, message);
                break;
            default:
                if (isGroup) {
                    // Handle non-command group messages — chatbot si activé dans le groupe
                    if (userMessage) {
                        try {
                            const fs = require('fs');
                            const path = require('path');
                            const ugd = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/userGroupData.json')));
                            if (ugd.chatbot && ugd.chatbot[chatId]) {
                                await handleChatbotResponse(sock, chatId, message, userMessage, senderId);
                            }
                        } catch (e) { /* chatbot non activé */ }
                    }
                    await handleTagDetection(sock, chatId, message, senderId);
                    await handleMentionDetection(sock, chatId, message);
                }
                commandExecuted = false;
                break;
        }

        // If a command was executed, show typing status after command execution
        if (commandExecuted !== false) {
            // Command was executed, now show typing status after command execution
            await showTypingAfterCommand(sock, chatId);
        }

        // Function to handle .groupjid command
        async function groupJidCommand(sock, chatId, message) {
            const groupJid = message.key.remoteJid;

            if (!groupJid.endsWith('@g.us')) {
                return await sock.sendMessage(chatId, {
                    text: "❌ This command can only be used in a group."
                });
            }

            await sock.sendMessage(chatId, {
                text: `✅ Group JID: ${groupJid}`
            }, {
                quoted: message
            });
        }

        if (userMessage.startsWith('.')) {
            // After command is processed successfully
            await addCommandReaction(sock, message);
        }
    } catch (error) {
        console.error('❌ Error in message handler:', error.message);
        // Only try to send error message if we have a valid chatId
        if (chatId) {
            await sock.sendMessage(chatId, {
                text: '❌ Failed to process command!',
                ...channelInfo
            });
        }
    }
}

async function handleGroupParticipantUpdate(sock, update) {
    try {
        const { id, participants, action, author } = update;

        // Check if it's a group
        if (!id.endsWith('@g.us')) return;

        // Respect bot mode: only announce promote/demote in public mode
        let isPublic = true;
        try {
            const modeData = JSON.parse(fs.readFileSync('./data/messageCount.json'));
            if (typeof modeData.isPublic === 'boolean') isPublic = modeData.isPublic;
        } catch (e) {
            // If reading fails, default to public behavior
        }

        // Handle promotion events
        if (action === 'promote') {
            if (!isPublic) return;
            await handlePromotionEvent(sock, id, participants, author);
            return;
        }

        // Handle demotion events
        if (action === 'demote') {
            if (!isPublic) return;
            await handleDemotionEvent(sock, id, participants, author);
            return;
        }

        // Handle join events
        if (action === 'add') {
            await handleJoinEvent(sock, id, participants);
        }

        // Handle leave events
        if (action === 'remove') {
            await handleLeaveEvent(sock, id, participants);
            // ── Anti-leave v2.0 ──
            for (const participant of participants) {
                await handleAntileave(sock, id, participant);
            }
        }
    } catch (error) {
        console.error('Error in handleGroupParticipantUpdate:', error);
    }
}

// Instead, export the handlers along with handleMessages
module.exports = {
    handleMessages,
    handleGroupParticipantUpdate,
    handleStatus: async (sock, status) => {
        await handleStatusUpdate(sock, status);
        // ── Auto React Status v2.0 ──
        await handleAutoReact(sock, status);
    }
};
