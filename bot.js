const DiscordJS = require("discord.js");
require("dotenv").config();

const client = new DiscordJS.Client({
  intents: ["GUILDS"]
});

let bot = {
  client
}

client.slashcommands = new DiscordJS.Collection();
client.loadSlashCommands = (bot, reload) => require("./handlers/slashcommands")(bot, reload);
client.loadSlashCommands(bot, false);

client.on("interactionCreate", interaction => {
  if (!interaction.isCommand()) return
  if (!interaction.inGuild()) return interaction.reply("Komenda może być użyta tylko na serwerze");

  const slashcmd = client.slashcommands.get(interaction.commandName);


  if (!slashcmd) return interaction.reply({ content: "Niepoprawna komenda", ephemeral: true });

  if (slashcmd.perms && !interaction.member.permissions.has(slashcmd.perm))
    return interaction.reply("Nie masz uprawnień do tej komendy")

  slashcmd.run(client, interaction);
})


client.on('ready', async () => {

  console.log(`Logged in as ${client.user.tag}!`);
  // const guildId = '935268119365156884';
  // const guild = client.guilds.cache.get(guildId);


  // let commands;

  // if (guild) {
  //   commands = guild.commands;
  // } else {
  //   commands = client.application.commands;
  // }

  // const permissions2 = {
  //   id: guild.roles.everyone.id,
  //   type: 'ROLE',
  //   permission: true,
  // };
  // let commandsList = await guild.commands.fetch();

  // commandsList.forEach(slashCommand => {
  //   guild.commands.permissions.add({
  //     command: slashCommand.id,
  //     permissions: [permissions2]
  //   });
  // });
})

client.login(process.env.BOT_TOKEN);