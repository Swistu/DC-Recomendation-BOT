const DiscordJS = require("discord.js");
require("dotenv").config();

const client = new DiscordJS.Client({ 
  intents: [ "GUILDS" ]
});

let bot = {
  client
}

client.slashcommands= new DiscordJS.Collection();
client.loadSlashCommands = (bot, reload) => require("./handlers/slashcommands")(bot, reload);
client.loadSlashCommands(bot, false);

client.on("interactionCreate", interaction => {
  if(!interaction.isCommand()) return
  if(!interaction.inGuild()) return interaction.reply("Komenda może być użyta tylko na serwerze");

  const slashcmd = client.slashcommands.get(interaction.commandName);

  if(!slashcmd) return interaction.reply({content: "Niepoprawna komenda", ephemeral: true});

  if(slashcmd.perms && !interaction.member.permissions.has(slashcmd.perm))
    return interaction.reply("Nie masz uprawnień do tej komendy")

  slashcmd.run(client, interaction);
})

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

  const guildId = '935268119365156884';
  const guild = client.guilds.cache.get(guildId);

  let commands;

  if (guild){
    commands = guild.commands;
  } else {
    commands = client.application.commands;
  }
})

// client.on('interactionCreate', async (interaction) => {
//   if (!interaction.isCommand()) return;

//   const { commandName, options } = interaction;

//   if(commandName === 'rekomenduj'){

//     let rekomendowany = interaction.options.getUser("gracz").tag;

//     let powod = interaction.options.getString("powod");

//     client

//     if(interaction.member.roles.cache.some(r => r.name === "Korpus Oficerów")){
//       interaction.reply(`Kto rekomenduje: ${interaction.user.tag} \n Kogo rekomenduje: ${rekomendowany} \n powód: ${powod} \n\n ` );
//     }
//     else{
//       interaction.reply("Nie masz rangi na to byqu");
//     }
//   }
// });

client.login(process.env.BOT_TOKEN);