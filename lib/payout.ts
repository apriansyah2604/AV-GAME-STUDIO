import { processPayout } from '@/lib/roblox';

export async function executeRobuxPayout(username: string, amount: number) {
  const botUrl = process.env.ROBLOX_SERVER_URL;
  const secret = process.env.PAYOUT_SECRET_KEY;

  if (botUrl && secret) {
    const cleanBotUrl = botUrl.endsWith('/') ? botUrl.slice(0, -1) : botUrl;
    const response = await fetch(`${cleanBotUrl}/api/payout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, amount, secret }),
    });

    const data = await response.json().catch(() => ({
      success: false,
      message: 'Bot payout tidak mengembalikan JSON yang valid.',
    }));

    return {
      ...data,
      status: response.status,
    };
  }

  return processPayout(username, amount);
}
