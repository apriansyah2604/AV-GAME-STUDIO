const noblox = require('noblox.js');
require('dotenv').config();

async function test() {
  const cookie = process.env.ROBLOX_COOKIE;
  console.log('Testing cookie starting with:', cookie ? cookie.substring(0, 50) : 'MISSING');
  try {
    await noblox.setCookie(cookie);
    const user = await noblox.getCurrentUser();
    console.log('SUCCESS! Logged in as:', user.UserName);
  } catch (err) {
    console.error('FAILED!', err.message);
  }
}

test();
