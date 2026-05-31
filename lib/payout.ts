import { processPayout } from '@/lib/roblox';

export async function executeRobuxPayout(username: string, amount: number) {
  const botUrl = process.env.ROBLOX_SERVER_URL;
  const secret = process.env.PAYOUT_SECRET_KEY;

  if (botUrl && secret) {
    console.log(`[PAYOUT] Using external bot at ${botUrl}`);
    const cleanBotUrl = botUrl.endsWith('/') ? botUrl.slice(0, -1) : botUrl;
    const response = await fetch(`${cleanBotUrl}/api/payout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, amount, secret }),
    });

    const bodyText = await response.text();
    console.log(`[PAYOUT] Bot response (${response.status}):`, bodyText);

    let data;
    try {
      data = JSON.parse(bodyText);
    } catch (e) {
      data = {
        success: false,
        message: `Bot payout tidak mengembalikan JSON yang valid. Raw: ${bodyText.substring(0, 100)}`,
      };
    }

    return {
      ...data,
      status: response.status,
    };
  }

  console.log(`[PAYOUT] Using local noblox.js`);
  return processPayout(username, amount);
}
