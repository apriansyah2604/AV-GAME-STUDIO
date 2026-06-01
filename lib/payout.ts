import { processPayout } from '@/lib/roblox';

/**
 * Memproses Payout Robux.
 * SEKARANG: Diubah menjadi MANUAL sesuai permintaan user.
 * Aliran ini tidak lagi mengirim Robux otomatis via bot, 
 * melainkan mengembalikan status agar user menghubungi admin via WA.
 */
export async function executeRobuxPayout(username: string, amount: number) {
  console.log(`[PAYOUT] Manual mode active for ${username} (${amount} Robux)`);
  
  // Kita anggap "berhasil" di tahap sistem, tapi dengan flag 'manual'
  return {
    success: true,
    manual: true,
    message: 'Pembayaran diterima. Silakan klik tombol WhatsApp untuk klaim Robux Anda.',
    username,
    amount
  };
}
