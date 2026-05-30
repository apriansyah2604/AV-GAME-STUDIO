import noblox from 'noblox.js';

/**
 * Utilitas untuk menangani operasi API Roblox.
 * PERINGATAN: Penggunaan otomatisasi payout memiliki risiko banned jika terdeteksi aktivitas mencurigakan.
 */

let isInitialized = false;

export async function initRoblox() {
  const ROBLOSECURITY = process.env.ROBLOX_COOKIE;
  
  if (!ROBLOSECURITY) {
    throw new Error('ROBLOX_COOKIE tidak ditemukan di environment variables.');
  }

  // Jika sudah inisialisasi, jangan lakukan lagi untuk menghemat resource
  if (isInitialized) return;
  
  try {
    // Inisialisasi koneksi dengan cookie
    await noblox.setCookie(ROBLOSECURITY);
    const user = await noblox.getCurrentUser();
    console.log(`Berhasil login sebagai: ${user.UserName}`);
    isInitialized = true;
    return user;
  } catch (error: any) {
    console.error('Gagal inisialisasi Roblox:', error.message);
    isInitialized = false;
    throw error;
  }
}

export async function getGroupFunds() {
  const GROUP_ID = Number(process.env.ROBLOX_GROUP_ID);
  try {
    await initRoblox();
    // Tambahkan timeout atau retry jika perlu di masa depan
    const funds = await noblox.getGroupFunds(GROUP_ID);
    return funds;
  } catch (error: any) {
    console.error('Gagal mengambil saldo grup:', error.message);
    // Reset status inisialisasi jika error agar percobaan berikutnya mencoba login ulang
    isInitialized = false;
    throw error;
  }
}

export async function processPayout(username: string, amount: number) {
  const GROUP_ID = Number(process.env.ROBLOX_GROUP_ID);
  
  try {
    await initRoblox();

    // 1. Dapatkan User ID dari Username dengan Retry
    let userId;
    let retryCount = 0;
    while (retryCount < 3) {
      try {
        userId = await noblox.getIdFromUsername(username);
        break;
      } catch (e) {
        retryCount++;
        if (retryCount === 3) throw new Error(`Username "${username}" tidak ditemukan di Roblox setelah 3 kali percobaan.`);
        await new Promise(res => setTimeout(res, 1000)); // Tunggu 1 detik sebelum retry
      }
    }
    
    // 2. Cek apakah user ada di grup
    let memberInfo;
    try {
      memberInfo = await noblox.getGroupMemberInfo(GROUP_ID, userId);
    } catch (e) {
      throw new Error(`Gagal mengambil data grup. Pastikan ID Grup ${GROUP_ID} benar.`);
    }

    if (!memberInfo) {
      throw new Error(`User ${username} belum bergabung di grup.`);
    }

    // 3. Cek Saldo Grup
    const groupFunds = await noblox.getGroupFunds(GROUP_ID);
    console.log(`Saldo grup saat ini: ${groupFunds} Robux`);
    if (groupFunds < amount) {
      throw new Error(`Saldo Robux grup tidak cukup (Tersedia: ${groupFunds}).`);
    }

    // 4. Eksekusi Payout
    try {
      await noblox.groupPayout({
        group: GROUP_ID,
        member: [userId],
        amount: [amount],
        recurring: false,
        usePercentage: false
      });
    } catch (e: any) {
      if (e.message.includes('15 days') || e.message.includes('7 days')) {
        throw new Error('User harus berada di grup minimal selama 7-15 hari sebelum menerima payout.');
      }
      throw new Error(`Gagal mengirim Robux: ${e.message}`);
    }

    return {
      success: true,
      message: `Berhasil mengirim ${amount} Robux ke ${username}`,
      userId
    };
  } catch (error: any) {
    console.error('Payout Error:', error.message);
    isInitialized = false; // Reset jika terjadi error
    return {
      success: false,
      message: error.message
    };
  }
}
