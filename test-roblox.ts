import dotenv from 'dotenv';
dotenv.config();

import { initRoblox } from './lib/roblox.ts';

async function test() {
  console.log('--- Mengetes Koneksi Roblox ---');
  try {
    const user = await initRoblox();
    console.log('✅ Berhasil Login!');
    console.log('ID Akun:', user.UserID);
    console.log('Username:', user.UserName);
    console.log('-------------------------------');
  } catch (error: any) {
    console.error('❌ Gagal Login!');
    console.error('Error:', error.message);
    console.log('-------------------------------');
  }
}

test();
