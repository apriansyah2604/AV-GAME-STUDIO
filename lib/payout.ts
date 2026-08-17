/**
 * Memproses Payout Robux via Bot Hugging Face.
 * Website -> POST /api/payout ke bot (server/index.js) -> noblox.groupPayout.
 * Jika bot tidak dikonfigurasi (ROBLOX_SERVER_URL kosong), fallback ke mode manual.
 */

export async function executeRobuxPayout(username: string, amount: number) {
  const serverUrl = process.env.ROBLOX_SERVER_URL;
  const secret = process.env.PAYOUT_SECRET_KEY;

  // Jika bot HF belum dikonfigurasi, gunakan mode manual (hubungi admin via WA)
  if (!serverUrl || !secret) {
    console.log(`[PAYOUT] Manual mode (ROBLOX_SERVER_URL belum di-set) untuk ${username} (${amount} Robux)`);
    return {
      success: true,
      manual: true,
      message: 'Pembayaran diterima. Silakan klik tombol WhatsApp untuk klaim Robux Anda.',
      username,
      amount
    };
  }

  const cleanUrl = serverUrl.endsWith('/') ? serverUrl.slice(0, -1) : serverUrl;
  console.log(`[PAYOUT] Mengirim payout ke bot HF: ${amount} Robux untuk ${username}`);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(`${cleanUrl}/api/payout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, amount, secret }),
      signal: controller.signal,
      cache: 'no-store',
    });
    clearTimeout(timeoutId);

    const data = await response.json().catch(() => ({}));

    if (response.ok && data.success) {
      console.log(`[PAYOUT] Berhasil: ${amount} Robux ke ${username} (userId: ${data.userId})`);
      return {
        success: true,
        manual: false,
        message: `Robux berhasil dikirim ke ${username}.`,
        username,
        amount,
        userId: data.userId
      };
    }

    console.error(`[PAYOUT] Bot menolak/gagal: HTTP ${response.status} - ${data.message || ''}`);
    return {
      success: false,
      manual: false,
      message: data.message || `Bot gagal mengirim Robux (HTTP ${response.status}).`,
      username,
      amount
    };
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.error(`[PAYOUT] Error menghubungi bot: ${error.message}`);
    return {
      success: false,
      manual: false,
      message: error.name === 'AbortError'
        ? 'Bot payout sedang tidur (Hugging Face free tier). Silakan aktifkan bot lalu coba lagi.'
        : `Gagal menghubungi bot payout: ${error.message}`,
      username,
      amount
    };
  }
}