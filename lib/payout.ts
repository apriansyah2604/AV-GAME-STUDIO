export async function executeRobuxPayout(username: string, amount: number) {
  console.info(`[PAYOUT] Manual fulfillment required for ${username} (${amount} Robux).`);
  return {
    success: true,
    manual: true,
    message: 'Pembayaran diterima. Silakan chat seller untuk memproses pesanan.',
    username,
    amount,
  };
}