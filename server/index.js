const express = require('express');
const noblox = require('noblox.js');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

/**
 * =================================================================
 * CONFIGURATION (Isi data kamu di sini agar menjadi Single File)
 * =================================================================
 */
const CONFIG = {
    // Cookie ROBLOSECURITY kamu
    ROBLOX_COOKIE: "_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_CAEaAhADIhwKBGR1aWQSFDE0NDExNDY4MjgwNjcwNzMxMjM3KAM.AUqXcAZ7zsoA82cxpDpKy8972K7wdz2HP_em1yRUAUC0vDJ2o4Fw2LJ2b5C6D3MzrE4JxDymBIT4miFtucxY5Gcmof9PB5bG4HNzrPmyJjSdfvirjiNhZoUIwrYsyWkAevnOu26mZHowX8uO0KLrVZFDNkqbWiJT5XI-Ono5lzIjoBC-ihXpfYAYhfEJGQGRucWiHHblxjF322bJnpqr0rk01nvsaHkh-8XVBhwMv5tPe2P2o4tVNOJWiq2Uu2rwrjHPou5tDWnxtCkCEhlNk9m2Tyslb5BgVeJrXrK_gxNM-jN8LJal0U3CX2_KohSKYfS7xSPCbvbTJD81epundpalBzw019Aqs0qdcn_J5SlPCRaop1Gvc0BdaFHwVzAiTb4y_KZQGmWeI5VNefk7byDMjhChYAHtsflphq0ZKDwBhFyBVSGcIne3U6kNbdDEVYyAVdvYQlcuPhmawieb1jhdnH28-mlDe5iI6V3GjAv5lvzGzuOOEFLE6I5C6C_4AeY412pvepClGBA7CrrgTZhC2IOmmxCbZvnNGmVUvjxaEam8BOzksWgePsRSfh66j7bw2mXtGjQ-IiBQCmUQecKejppkgIqyQOgh2PcCnOFnvnhWsfi6qr-rCfhYWwQaspaKJ5khUkFLqCHRBzIvFnJEDXJjnqA-G8dQhhbfFX7KKFM2-ocZ-z1aZYLppjtC8DZNj4fTSZmqoWOh2pYjA42nShVdCm6B3S2e6FufneXLr_ujMd7QSmzFZUaFWFji0xuAk6vSP_dqY_lDq8-GkkSR0v_5aIpscW28IH2xzft-ZXcjPp0q0U7RAa_16PLcITPawHop4LyKXgxhaAeQlJbDOT3A4S0utVz14mIdfjz11WbJcuY_28Uu4xArr_dSzdypP3RJTTxNMsZPUA5M4UcIZ8Gy_-qJXdd0_ur91g5cAXBO1nhu_pnbSHt-YNmAN2vbLg",
    
    // ID Grup Roblox kamu
    ROBLOX_GROUP_ID: 34024429,
    
    // Secret Key untuk keamanan API (Harus sama dengan di Next.js)
    PAYOUT_SECRET_KEY: "av-studio-super-secret-key",
    
    // Port server berjalan (Otomatis mengikuti environment Hugging Face)
    PORT: process.env.ROBLOX_SERVER_PORT || process.env.PORT || 7860
};
/** ================================================================= */

const app = express();
const COOKIE_FILE = path.join(__dirname, 'session.json');

app.use(cors());
app.use(express.json());

let currentCookie = CONFIG.ROBLOX_COOKIE;

// Fungsi untuk menyimpan cookie ke file (Persistensi)
function saveCookie(cookie) {
    try {
        fs.writeFileSync(COOKIE_FILE, JSON.stringify({ cookie, updatedAt: new Date() }));
        currentCookie = cookie;
        console.log('[File] Cookie terbaru disimpan ke session.json');
    } catch (err) {
        console.error('[File] Gagal menyimpan cookie:', err.message);
    }
}

// Fungsi untuk memuat cookie dari file saat startup
function loadCookie() {
    try {
        if (fs.existsSync(COOKIE_FILE)) {
            const data = JSON.parse(fs.readFileSync(COOKIE_FILE));
            currentCookie = data.cookie;
            console.log('[File] Cookie berhasil dimuat dari session.json');
        }
    } catch (err) {
        console.error('[File] Gagal memuat cookie dari file:', err.message);
    }
}

// Fungsi Inisialisasi & Auto Refresh Cookie
async function initRoblox() {
    if (!currentCookie) {
        console.error('[Roblox] ERROR: Cookie tidak ditemukan!');
        return;
    }

    try {
        await noblox.setCookie(currentCookie);
        const user = await noblox.getCurrentUser();
        console.log(`[Roblox] Berhasil Login: ${user.UserName} (ID: ${user.UserID})`);

        // Cek saldo grup sebagai verifikasi awal
        const funds = await noblox.getGroupFunds(CONFIG.ROBLOX_GROUP_ID);
        console.log(`[Roblox] Saldo Grup Saat Ini: ${funds} Robux`);

        // Refresh cookie agar tetap aktif (Mencegah Logout Otomatis)
        const newCookie = await noblox.refreshCookie(currentCookie);
        if (newCookie && newCookie !== currentCookie) {
            saveCookie(newCookie);
            console.log('[Roblox] Cookie berhasil di-refresh.');
        }
    } catch (error) {
        console.error('[Roblox] Gagal Inisialisasi:', error.message);
        if (error.message.includes('not logged in')) {
            console.error('[CRITICAL] Cookie sudah MATI. Silahkan ganti dengan cookie baru di file index.js!');
        }
    }
}

// Jalankan auto-refresh setiap 2 jam agar sesi tetap hidup
setInterval(async () => {
    console.log('[Task] Menjalankan auto-refresh sesi...');
    await initRoblox();
}, 1000 * 60 * 60 * 2);

// Endpoint API Payout
app.post('/api/payout', async (req, res) => {
    const { username, amount, secret } = req.body;

    // 1. Validasi Keamanan
    if (secret !== CONFIG.PAYOUT_SECRET_KEY) {
        console.warn(`[Security] Percobaan akses ilegal dari IP: ${req.ip}`);
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // 2. Validasi Input
    if (!username || !amount || amount <= 0) {
        return res.status(400).json({ success: false, message: 'Data tidak lengkap' });
    }

    try {
        // Pastikan login masih aktif
        await noblox.setCookie(currentCookie);

        // Cari User ID
        const userId = await noblox.getIdFromUsername(username);
        
        // Eksekusi Payout
        await noblox.groupPayout({
            group: CONFIG.ROBLOX_GROUP_ID,
            member: [userId],
            amount: [amount],
            recurring: false,
            usePercentage: false
        });

        console.log(`[Payout] Sukses mengirim ${amount} Robux ke ${username}`);
        res.json({ 
            success: true, 
            message: `Berhasil mengirim ${amount} Robux ke ${username}`,
            userId 
        });

    } catch (error) {
        console.error('[Payout Error]', error.message);
        let msg = error.message;
        if (msg.includes('7 days')) msg = "User harus di grup minimal 7 hari.";
        res.status(500).json({ success: false, message: msg });
    }
});

// Endpoint untuk update cookie via API (Jika ingin update tanpa restart server)
app.post('/api/update-cookie', async (req, res) => {
    const { newCookie, secret } = req.body;
    if (secret !== CONFIG.PAYOUT_SECRET_KEY) return res.status(401).send('Unauthorized');

    try {
        await noblox.setCookie(newCookie);
        const user = await noblox.getCurrentUser();
        saveCookie(newCookie);
        res.json({ success: true, message: `Cookie diperbarui untuk: ${user.UserName}` });
    } catch (err) {
        res.status(400).json({ success: false, message: 'Cookie baru tidak valid' });
    }
});

// Health Check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'online', 
        roblox_group: CONFIG.ROBLOX_GROUP_ID,
        cookie_active: !!currentCookie 
    });
});

// Endpoint untuk cek saldo grup
app.get('/api/funds', async (req, res) => {
    try {
        await noblox.setCookie(currentCookie);
        const funds = await noblox.getGroupFunds(CONFIG.ROBLOX_GROUP_ID);
        res.json({ success: true, funds });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Start Server
app.listen(CONFIG.PORT, "0.0.0.0", () => {
    console.log(`================================================`);
    console.log(`Roblox Payout Server Berjalan di Port ${CONFIG.PORT}`);
    console.log(`URL API: http://localhost:${CONFIG.PORT}/api/payout`);
    console.log(`================================================`);
    
    loadCookie(); // Muat cookie dari file jika ada
    initRoblox().catch(err => console.error('Startup Error:', err.message));
});
