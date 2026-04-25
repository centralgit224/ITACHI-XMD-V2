const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../data/antimentionstatus.json');
const channelInfo = {
    forwardingScore: 1, isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363408304719268@newsletter',
        newsletterName: 'ITACHI-XMD', serverMessageId: -1
    }
};

if (!fs.existsSync(configPath)) fs.writeFileSync(configPath, JSON.stringify({ enabled: false }));
function getConfig() { try { return JSON.parse(fs.readFileSync(configPath)); } catch { return { enabled: false }; } }
function saveConfig(d) { fs.writeFileSync(configPath, JSON.stringify(d, null, 2)); }

// Commande toggle
async function antimentionstatusCommand(sock, chatId, senderId, args, message) {
    const action = args[0]?.toLowerCase();
    const config = getConfig();

    if (!action) {
        return await sock.sendMessage(chatId, {
            image: { url: 'https://i.ibb.co/ds0fdYCX/IMG-20260409-WA0249.jpg' },
            caption: `╔═════════════════════╗\n║   🥷 *𝗜𝗧𝗔𝗖𝗛𝗜-𝗫𝗠𝗗-𝐕2* 🥷   ║\n╠═════════════════════╣\n║ ⚠️ *ANTI-MENTION STATUT*  ║\n╚═════════════════════╝\n\n📊 *Statut :* ${config.enabled ? '🟢 Activé' : '🔴 Désactivé'}\n\n📌 *Commandes :*\n┌─────────────────────\n│ ⬡ .antimentionstatus on\n│ ⬡ .antimentionstatus off\n└─────────────────────\n\n🛡️ Supprime automatiquement quand quelqu'un\nmentionne le groupe via son statut.\n\n> _Propulsé par 🥷 *IBSACKO™*_`,
            contextInfo: channelInfo
        }, { quoted: message });
    }

    config.enabled = (action === 'on');
    saveConfig(config);
    return await sock.sendMessage(chatId, {
        text: `⚠️ *Anti-Mention Statut :* ${config.enabled ? '🟢 Activé' : '🔴 Désactivé'}\n${config.enabled ? '> _Les mentions via statut seront supprimées._' : '> _Protection désactivée._'}`,
        contextInfo: channelInfo
    }, { quoted: message });
}

// Détecte si un message est une mention de groupe via statut
function isStatusMentionMsg(mek) {
    try {
        const msg = mek?.message;
        if (!msg) return false;

        // CAS 1 : Type officiel Baileys — groupMentionedMessage
        if (msg.groupMentionedMessage) return true;

        // CAS 2 : Message qui répond à un statut (contextInfo.remoteJid = status@broadcast)
        const ctxSources = [
            msg.extendedTextMessage?.contextInfo,
            msg.imageMessage?.contextInfo,
            msg.videoMessage?.contextInfo,
            msg.stickerMessage?.contextInfo,
            msg.audioMessage?.contextInfo,
        ].filter(Boolean);

        for (const ctx of ctxSources) {
            if (ctx?.remoteJid === 'status@broadcast') return true;
        }

        return false;
    } catch { return false; }
}

// Handler principal — appelé depuis index.js sur CHAQUE message de groupe
async function handleAntimentionStatus(sock, chatId, sender, mek) {
    try {
        const config = getConfig();
        if (!config.enabled) return false;
        if (!chatId?.endsWith('@g.us')) return false;
        if (mek?.key?.fromMe) return false;

        if (!isStatusMentionMsg(mek)) return false;

        // Vérifier si le bot est admin (nécessaire pour supprimer)
        let isBotAdmin = false;
        try {
            const meta = await sock.groupMetadata(chatId);
            const botJid = sock.user.id.replace(/:\d+/, '') + '@s.whatsapp.net';
            isBotAdmin = meta.participants.some(p =>
                p.id === botJid && (p.admin === 'admin' || p.admin === 'superadmin')
            );
        } catch { isBotAdmin = true; } // En cas d'erreur, on essaie quand même

        if (!isBotAdmin) {
            console.log('[antimentionstatus] Bot non admin, impossible de supprimer');
            return false;
        }

        // Supprimer le message
        const deleteKey = {
            remoteJid: chatId,
            id: mek.key.id,
            participant: mek.key.participant || sender,
            fromMe: false
        };

        // Tentative 1 : sendMessage delete
        try {
            await sock.sendMessage(chatId, { delete: deleteKey });
            console.log(`🛡️ [antimentionstatus] Supprimé @${(sender || '').split('@')[0]}`);
            return true;
        } catch {
            // Tentative 2 : relayMessage avec proto
            try {
                const { proto } = require('@whiskeysockets/baileys');
                const deleteMsg = proto.Message.fromObject({
                    protocolMessage: {
                        key: deleteKey,
                        type: proto.Message.ProtocolMessage.Type.REVOKE
                    }
                });
                await sock.relayMessage(chatId, deleteMsg, {});
                console.log(`🛡️ [antimentionstatus] Supprimé via relay @${(sender || '').split('@')[0]}`);
                return true;
            } catch (e2) {
                console.error('❌ [antimentionstatus] Échec suppression:', e2.message);
                return false;
            }
        }
    } catch (e) {
        console.error('❌ [antimentionstatus]', e.message);
        return false;
    }
}

module.exports = antimentionstatusCommand;
module.exports.isStatusMention = isStatusMentionMsg;
module.exports.isEnabled = () => getConfig().enabled;
module.exports.handleAntimentionStatus = handleAntimentionStatus;
