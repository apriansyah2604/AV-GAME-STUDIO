const noblox = require('noblox.js');

async function checkUser() {
  const username = 'AVGAMESTUDIO';
  try {
    const id = await noblox.getIdFromUsername(username);
    console.log(`User ${username} exists with ID: ${id}`);
    
    // Check if user is terminated
    const playerInfo = await noblox.getPlayerInfo(id);
    console.log('Player Info:', JSON.stringify(playerInfo, null, 2));
    
    if (playerInfo.isBanned) {
      console.log('WARNING: User is Banned/Terminated.');
    } else {
      console.log('User is NOT Banned.');
    }
  } catch (err) {
    console.error('Error checking user:', err.message);
    if (err.message.includes('not found')) {
      console.log('The username was not found. This could mean it is banned or misspelled.');
    }
  }
}

checkUser();
