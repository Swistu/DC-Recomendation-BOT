const DiscordJS = require("discord.js");
require("dotenv").config();

const client = new DiscordJS.Client({ 
  intents: [ "GUILDS" ]
});

let bot = {
  client
}

const guildId = '935268119365156884';

client.slashcommands= new DiscordJS.Collection();

client.loadSlashCommands = (bot, reload) => require("./handlers/slashcommands")(bot, reload);
client.loadSlashCommands(bot, false);


client.on("ready", async () => {
  const guild = client.guilds.cache.get(guildId)
  if(!guild)
    return console.error("Nie znaleziono serwera")
  
  await guild.commands.set([...client.slashcommands.values()]);

  console.log(`Załadowano ${client.slashcommands.size} komend`);
  process.exit(0);
})


client.login(process.env.BOT_TOKEN);