// delete-commands.ts (if you have ts-node installed and configured)
// or delete-commands.js (if you compile it or run directly with node)

import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10'; // Use v10 for latest API version
import * as dotenv from 'dotenv';

dotenv.config(); // Load environment variables from your .env file

const CLIENT_ID = process.env.DISCORD_CLIENT_ID; // Your bot's client ID
const GUILD_ID = process.env.DISCORD_GUILD_ID; // Your testing server's ID
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN; // Your bot's token

if (!CLIENT_ID || !GUILD_ID || !BOT_TOKEN) {
  console.error(
    'Missing DISCORD_CLIENT_ID, DISCORD_GUILD_ID, or DISCORD_BOT_TOKEN in .env file.',
  );
  process.exit(1);
}

const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);

(async () => {
  try {
    console.log('Attempting to delete all guild commands...');

    // Delete all guild commands for the specified guild
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: [] }, // An empty array tells Discord to delete all commands
    );

    console.log(
      'Successfully deleted all guild commands for the testing server.',
    );

    // Optional: If you suspect global commands are also duplicated, you can uncomment this.
    // Be aware that global command updates can take up to an hour.
    /*
    console.log('Attempting to delete all global commands...');
    await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: [] },
    );
    console.log('Successfully deleted all global commands. (Note: Global updates can take up to 1 hour)');
    */
  } catch (error) {
    console.error('Error deleting commands:', error);
  } finally {
    process.exit(0); // Exit the script
  }
})();
