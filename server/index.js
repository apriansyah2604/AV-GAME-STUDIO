const express = require('express');
const noblox = require('noblox.js');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

/**
 * =================================================================
 * CONFIGURATION
 * =================================================================
 */
const CONFIG = {
    // Cookie terbaru Anda (Edisi Hong Kong)
    ROBLOX_COOKIE: "_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_CAEaAhADIhsKBGR1aWQSEzk4NjkxNDkwMjU2MTI5NjEwNTgoAw.iqEAdoDJO9UamWSyNtjRf73Wb8I_o227ZtHCFNfCNkQhHTu3yAfbUPU4_AHKsdsRs9cmnLRcrYnflcrAsbGsIaLWqrzYD9Y_AFcl37EHZiBXQYXEkL6en-Q9D8yabkJ9qFot749CoS-d6hGSd3vwmJtSCj3Un_MzQgFTpnrIHb_zJdzjtkn3uO9jRs7-c3EOvsA6tE8sd5FSIN0VjFiB-k9T0VOc08FIaii3pdoGPsTe971emNh2qCTh2iadAgKHbaqC3vGtrbe8z3-YltGbbJaXBtH_ELCDWBzTweFKAhn5h4NBhQPDiXJcR_EAv7d6uPwnDYTsytLIyiC8vf4XYKcYXo61U-3Vx9MfExl0lJc3aepsQd26LagrR0-w2AEOWs_P1MVjUbQv08mq7hv5vzEvfTvQRK3PETsiQ9CRf1Gbmyfru3ejXixdI7BlDPgssoHgfQ4C2GUmyKns5nCPLqNmimOdwe1nWb4UGRedr9oS-ohBGV3HsomDiRUj9K-Q7ATkkzJn05SONkg8SDNYkXbMkEKVi48pBfLBC7KmcGHQgtfQ54Fy5c-TPCWNc60d7HZ4tvmaCrWXAfSC-XwZAwyc01RswQzCangYZSPB6s4QzSMH3K5TdQCKzTcDHQWWS4UbNGvsaR93O_EPSiFsrF-bzgveCrvMWYsH5rLOGO7No0S_AUl-bQFo6IsndnN70UtDVr9CdvmJUT41YdvK5B0Vfor70HdnkMC_qNh1I39_lsHdaZL2ICAcoFL3wCQYid5dBoXcXdHAWJeqHY2zNFK16lWkHbsJkHGm_TNBK5tTS1lqD3Jn2HIXMQQaFbZe8bX0fDnbU5OH6QnwZBnqxl4p5R9u15yI1oMM11dPQnlzWwIUMfCyMlhHZrBa2rZmU6ZWCzfwCE0sD53cS5bVCxAUdijFe2neBMPhTMs0tbSmDDe6yUEnwrqq2VN0PFuyTOdtmA",
    
    ROBLOX_GROUP_ID: 390244299,
    PAYOUT_SECRET_KEY: "av-studio-super-secret-key",
    PORT: process.env.PORT || 7860,
    
    // [OPSIONAL] Gunakan Proxy Residensial jika sering kena Error 403/Challenge
    // Format: http://username:password@ip:port
    PROXY_URL: process.env.PROXY_URL || null 
};

const app = express();
const COOKIE_FILE = path.join(__dirname, 'session.json');

app.use(cors());
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
    if (secret !== CONFIG.PAYOUT_SECRET_KEY) return res.status(401).json({ success: false, message: 'Unauthorized' });

    try {
        await noblox.setCookie(currentCookie);
        const funds = await noblox.getGroupFunds(CONFIG.ROBLOX_GROUP_ID);
        res.json({ success: true, funds });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get('/', (req, res) => res.send('Roblox Payout Bot is Online!'));

app.listen(CONFIG.PORT, "0.0.0.0", () => {
    console.log(`Server aktif di port ${CONFIG.PORT}`);
    loadCookie();
    initRoblox().catch(err => console.error('Startup Error:', err.message));
});
