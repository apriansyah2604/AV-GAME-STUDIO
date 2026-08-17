const express = require('express');
const noblox = require('noblox.js');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

/**
 * =================================================================
 * CONFIGURATION
 * Semua nilai rahasia diambil dari environment variables.
 * Untuk Hugging Face Spaces, set di: Settings -> Variables and secrets
 * =================================================================
 */
const CONFIG = {
    // Cookie akun Roblox Anda (.ROBLOSECURITY). WAJIB diisi via env.
    ROBLOX_COOKIE: process.env.ROBLOX_COOKIE,
    ROBLOX_GROUP_ID: Number(process.env.ROBLOX_GROUP_ID) || 390244299,
    PAYOUT_SECRET_KEY: process.env.PAYOUT_SECRET_KEY,
    PORT: process.env.PORT || 7860,

    // [OPSIONAL] Gunakan Proxy Residensial jika sering kena Error 403/Challenge
    // Format: http://username:password@ip:port
    PROXY_URL: process.env.PROXY_URL || null
};

const app = express();
const COOKIE_FILE = path.join(__dirname, 'session.json');

app.use(cors({
    origin: '*', // Izinkan semua origin untuk pengecekan saldo publik
    methods: ['GET', 'POST']
}));
app.use(express.json());

let currentCookie = CONFIG.ROBLOX_COOKIE;
let isInitializing = false;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper untuk log dengan timestamp
function log(msg, type = 'INFO') {
    const time = new Date().toLocaleTimeString('id-ID');
    console.log(`[${time}] [${type}] ${msg}`);
}

function saveCookie(cookie) {
    try {
        fs.writeFileSync(COOKIE_FILE, JSON.stringify({ cookie, updatedAt: new Date() }));
        currentCookie = cookie;
        log('Cookie terbaru disimpan ke session.json', 'FILE');
    } catch (err) {
        log('Gagal menyimpan cookie: ' + err.message, 'ERROR');
    }
}

function loadCookie() {
    try {
        if (fs.existsSync(COOKIE_FILE)) {
            const data = JSON.parse(fs.readFileSync(COOKIE_FILE));
            currentCookie = data.cookie;
            log('Cookie dimuat dari session.json', 'FILE');
        }
    } catch (err) {
        log('Belum ada session.json, menggunakan cookie dari CONFIG.', 'FILE');
    }
}

async function initRoblox() {
    if (isInitializing) return;
    isInitializing = true;

    if (!currentCookie) {
        log('ERROR: Cookie tidak ditemukan!', 'ERROR');
        isInitializing = false;
        return;
    }

    try {
        // Cek Lokasi Server
        try {
            const response = await fetch('https://ipapi.co/json/');
            const ipInfo = await response.json();
            log(`Bot berjalan dari: ${ipInfo.city || 'Unknown'}, ${ipInfo.country_name || 'Unknown'} (IP: ${ipInfo.ip || 'Unknown'})`, 'SERVER');
        } catch (e) {
            log('Gagal mengambil lokasi server.', 'WARNING');
        }

        await noblox.setCookie(currentCookie);
        const user = await noblox.getAuthenticatedUser();
        log(`Berhasil Login: ${user.UserName} (ID: ${user.UserID})`, 'ROBLOX');

        const funds = await noblox.getGroupFunds(CONFIG.ROBLOX_GROUP_ID);
        log(`Saldo Grup: ${funds} Robux`, 'ROBLOX');

        // Auto Refresh
        log('Mencoba refresh cookie...', 'ROBLOX');
        const newCookie = await noblox.refreshCookie(currentCookie);
        if (newCookie && newCookie !== currentCookie) {
            saveCookie(newCookie);
            log('Cookie berhasil di-refresh.', 'SUCCESS');
        } else {
            log('Cookie masih valid, tidak perlu refresh.', 'INFO');
        }
    } catch (error) {
        log('Init Error: ' + error.message, 'ERROR');
        if (error.message.includes('401')) {
            log('Saran: Cookie hangus. Ambil cookie baru via VPN Hong Kong.', 'ADVICE');
        } else if (error.message.includes('403')) {
            log('Saran: Akun terdeteksi bot/IP diblokir. Gunakan Proxy Residensial.', 'ADVICE');
        }
    } finally {
        isInitializing = false;
    }
}

setInterval(async () => {
    log('Menjalankan auto-refresh sesi berkala...', 'TASK');
    await initRoblox();
}, 1000 * 60 * 60 * 2);

app.post('/api/payout', async (req, res) => {
    const { username, amount, secret } = req.body;
    if (secret !== CONFIG.PAYOUT_SECRET_KEY) {
        log('Akses ditolak: Secret Key salah.', 'AUTH');
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    if (!username || !amount) return res.status(400).json({ success: false, message: 'Data tidak lengkap' });

    try {
        log(`Memproses ${amount} Robux ke ${username}...`, 'PAYOUT');
        await noblox.setCookie(currentCookie);
        const userId = await noblox.getIdFromUsername(username);
        
        // Simulasi jeda manusia
        const wait = Math.floor(Math.random() * 3000) + 2000;
        await delay(wait);

        await noblox.groupPayout({
            group: CONFIG.ROBLOX_GROUP_ID,
            member: [userId],
            amount: [amount]
        });

        log(`Sukses mengirim ke ${username}`, 'SUCCESS');
        res.json({ success: true, message: 'Payout Berhasil', userId });
    } catch (error) {
        log('Payout Error: ' + error.message, 'ERROR');
        let msg = error.message;
        if (msg.includes('7 days')) msg = "User harus berada di grup minimal 7-14 hari.";
        else if (msg.includes('Challenge')) msg = "Roblox meminta Captcha. Silahkan pancing dengan payout manual 1 Robux di browser VPN Hong Kong.";
        else if (msg.includes('not logged in')) msg = "Sesi bot habis. Bot akan mencoba refresh otomatis, silakan coba lagi dalam 1 menit.";
        
        res.status(500).json({ success: false, message: msg });
    }
});

app.get('/api/funds', async (req, res) => {
    const secret = req.query.secret;
    if (secret !== CONFIG.PAYOUT_SECRET_KEY) {
        log('Akses ditolak: Secret Key salah untuk cek saldo.', 'AUTH');
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    try {
        await noblox.setCookie(currentCookie);
        const funds = await noblox.getGroupFunds(CONFIG.ROBLOX_GROUP_ID);
        res.json({ success: true, funds });
    } catch (error) {
        log('Funds Check Error: ' + error.message, 'ERROR');
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get('/', (req, res) => res.send('Roblox Payout Bot is Online!'));

app.listen(CONFIG.PORT, "0.0.0.0", () => {
    console.log(`Server aktif di port ${CONFIG.PORT}`);
    if (!CONFIG.ROBLOX_COOKIE) {
        log('PERINGATAN: ROBLOX_COOKIE belum di-set. Bot tidak bisa login ke Roblox.', 'WARNING');
    }
    if (!CONFIG.PAYOUT_SECRET_KEY) {
        log('PERINGATAN: PAYOUT_SECRET_KEY belum di-set. Endpoint payout akan menolak semua request.', 'WARNING');
    }
    loadCookie();
    initRoblox().catch(err => console.error('Startup Error:', err.message));
});
