// @ts-ignore
import midtransClient from 'midtrans-client';

/**
 * Utilitas untuk menangani integrasi Midtrans.
 */

export const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY
});

export async function createTransaction(orderId: string, amount: number, itemDetails: any, customerDetails: any, metadata: { username: string, robux_amount: number }) {
  const parameter = {
    transaction_details: {
      order_id: orderId,
      gross_amount: amount
    },
    item_details: itemDetails,
    customer_details: customerDetails,
    // Gunakan custom_field untuk meneruskan data ke webhook
    custom_field1: metadata.username,
    custom_field2: metadata.robux_amount.toString(),
    // Aktifkan metode pembayaran umum secara eksplisit
    enabled_payments: ["gopay", "qris", "shopeepay", "bank_transfer"],
    credit_card: {
      secure: true
    }
  };

  try {
    const transaction = await snap.createTransaction(parameter);
    return transaction;
  } catch (error) {
    console.error('Midtrans Create Transaction Error:', error);
    throw error;
  }
}
