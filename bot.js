require("dotenv").config();
const Discord = require('discord.js');
const client = new Discord.Client({ 
  intents: [
    "GUILDS",
    "GUILD_MESSAGES"
  ]

});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', (message) => {
  if(message.content == "hi"){
    message.reply("hello");
  }
});
client.login(process.env.BOT_TOKEN);