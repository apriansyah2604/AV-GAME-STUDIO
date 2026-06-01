import noblox from 'noblox.js';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
  const cookie = process.env.ROBLOX_COOKIE;
  console.log('Testing cookie starting with:', cookie?.substring(0, 50));
  try {
    await noblox.setCookie(cookie);
    const user = await noblox.getCurrentUser();
    console.log('SUCCESS! Logged in as:', user.UserName);
  } catch (err) {
    console.error('FAILED!', err.message);
  }
}

test();
