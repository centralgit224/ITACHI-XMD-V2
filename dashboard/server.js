/**
 * ITACHI-XMD v2.0 — Dashboard Web
 * Développé par IBSACKO™
 */

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const fs = require('fs');
const os = require('os');
const settings = require('../settings');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const DASHBOARD_PORT = process.env.DASHBOARD_PORT || 3000;
const DASHBOARD_TOKEN = process.env.DASHBOARD_TOKEN || 'itachi-admin-2025';

// Global stats (populated by main bot)
global.dashStats = {
    messagesHandled: 0,
    commandsExecuted: 0,
    activeGroups: new Set(),
    startTime: Date.now(),
    logs: [],
    commandStates: {}
};

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Auth middleware
function authMiddleware(req, res, next) {
    const token = req.headers['x-auth-token'] || req.query.token;
    if (token !== DASHBOARD_TOKEN) {
        return res.status(401).json({ error: 'Non autorisé' });
    }
    next();
}

// ─── Routes API ───────────────────────────────────────────

// Serve dashboard
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Auth check
app.post('/api/auth', (req, res) => {
    const { token } = req.body;
    if (token === DASHBOARD_TOKEN) {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, error: 'Token invalide' });
    }
});

// Stats globales
app.get('/api/stats', authMiddleware, (req, res) => {
    const uptime = Math.floor((Date.now() - global.dashStats.startTime) / 1000);
    const mem = process.memoryUsage();

    res.json({
        uptime,
        uptimeStr: formatUptime(uptime),
        messagesHandled: global.dashStats.messagesHandled,
        commandsExecuted: global.dashStats.commandsExecuted,
        activeGroups: global.dashStats.activeGroups.size,
        ramUsed: Math.round(mem.rss / 1024 / 1024),
        ramTotal: Math.round(os.totalmem() / 1024 / 1024),
        cpuLoad: os.loadavg()[0].toFixed(2),
        platform: os.platform(),
        nodeVersion: process.version,
        botName: settings.botName,
        botVersion: settings.version,
        owner: settings.botOwner,
        prefix: settings.prefix,
        commandMode: settings.commandMode
    });
});

// Liste des commandes avec état
app.get('/api/commands', authMiddleware, (req, res) => {
    const commandsDir = path.join(__dirname, '../commands');
    const files = fs.readdirSync(commandsDir).filter(f => f.endsWith('.js'));
    const commands = files.map(f => ({
        name: f.replace('.js', ''),
        enabled: global.dashStats.commandStates[f.replace('.js', '')] !== false,
        size: fs.statSync(path.join(commandsDir, f)).size
    }));
    res.json(commands);
});

// Activer/désactiver une commande
app.post('/api/commands/:name/toggle', authMiddleware, (req, res) => {
    const { name } = req.params;
    const current = global.dashStats.command