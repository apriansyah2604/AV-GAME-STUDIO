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
    ROBLOX_COOKIE: "_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_CAEaAhADIhwKBGR1aWQSFDE0NDExNDY4MjgwNjcwNzMxMjM3KAM.aysEiBqBTmPi9uSpdJ1RjEEuzy4YBIBLi7lGOXQZLGPMZkXpu7K_ipU5Sb-6zFN0oSrdv-iz1f0ze3-7RouBM3TQK_mBEWU81l6BKsHjGEcv32fEkxTCrPapeTrxQlR6YwqF4MkpuJWK9m-_kbAL-HEnGAXkEAUI89G23u8DQBSOjLW3UXYE0Opg_Uiy2-7F5VAEdMyo9qREmV3tvOnNRh08d_DPwdbQY9yOJoX_mJPgSEqPwHHytYI2SZnqBqZfbtHEfFqiQka6xJ1Gk2uOSJ-VcXVI3MnwMyQlKcfplj7xF-1G9AFEaTQ7srlE_KiVDu_ZTRmtAy4AQtPMfBuWuI5Q8kZuS6o3wAEJTcjI7n7MPhgFwamflWfz8CDnMwC4WQggv3nWcvAsHdlZ90aWv3l9rvEcWC4bvrGWuGlKDtocuCXsW8NK36Q09u9gd4BFK-1mObOYJs2ROlgIYsGVhpGCJ2NtI5Cg7Zd_onKxZtwFZbrJOo8ZLgh-pQNjEFGD1G49vzGfPNVxH1dtrcIYPu5ywrmvS2AC29kE4bnNcuTIaN4meA6rWb70USFcqw_ZhOyywGlDDDn3ZOh6US6XzLEvdSt24fat6U84Ql-_srS0CuRYsjMe0zcN9Esbfiqio4bHxwIh-CkLRFjQSkgznIVufJY6R4xpaPQtWvU7irYarucnYTcmNRyOOmYyNZfvMvB2fExZDv55NJJpNsq4HnoWzJUX1_Q49tVUXGvlfUIl9G_IDbPTJnlXS_BBE_vGzKA_Fy-5T36k5m-UccAdZBQ5C1UoNgukvOvh2Q7k3g01yMwTr2tkX23eR6oah5OjYPd6Bly_NBGbZNS6A4OrjS_GTBzL1LXGvrQTb-SHjUzXdmWXx49qEG_V-6JnCaD6-f89XzMBvFrv8jXBiMWuxvoGHxBlebt_9Un4PmqXu814QFkGzgNJkkcs87Z6BFPgs1NO0A",
    
    // ID Grup Roblox kamu
    ROBLOX_GROUP_ID: 390244299,
    
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
