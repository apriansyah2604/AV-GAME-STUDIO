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

export async function createTransaction(orderId: string, amount: number, itemDetails: any, customerDetails: any) {
  const parameter = {
    transaction_details: {
      order_id: orderId,
      gross_amount: amount
    },
    item_details: itemDetails,
    customer_details: customerDetails,
    enabled_payments: ["gopay", "qris", "shopeepay"], // Membatasi hanya ke e-wallet & QRIS
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
