const { channelListener } = require("./utility/channelListener");
const { updateUser } = require("./database/updateUser");
const { doBackup } = require("./utility/doBackup");
const { MessageButton, MessageActionRow } = require("discord.js");
const DiscordJS = require("discord.js");
require("dotenv").config();

const client = new DiscordJS.Client({
  intents: ["GUILDS", "GUILD_MEMBERS"],
});

let bot = {
  client,
};

client.slashcommands = new DiscordJS.Collection();
client.loadSlashCommands = (bot, reload) =>
  require("./handlers/slashcommands")(bot, reload);
client.loadSlashCommands(bot, false);

client.on("interactionCreate", (interaction) => {
  if (!interaction.isCommand()) return;
  if (!interaction.inGuild())
    return interaction.reply("Komenda może być użyta tylko na serwerze");

  const slashcmd = client.slashcommands.get(interaction.commandName);
  if (!slashcmd)
    return interaction.reply({
      content: "Niepoprawna komenda",
      ephemeral: true,
    });
  if (slashcmd.perms && !interaction.member.permissions.has(slashcmd.perm))
    return interaction.reply("Nie masz uprawnień do tej komendy");

  slashcmd.run(client, interaction);
});

client.on("ready", async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  
  channelListener(client);
  await channel.send("Pobrano jedną koszulkę z Town Halla.");
  //Backup DB to channel only in production
  if (process.env.NODE_ENV !== "development") {
    const message = await doBackup(client);
    if (!message.valid) {
      console.log(message);
    }
  }
});

client.on("guildMemberRemove", async (member) => {
  await updateUser(member.user.id, { $set: { accountActive: false } });
});
client.on("channelCreate", async (newChannel) => {
  if (newChannel.parentId === process.env.STORAGE_CHANNEL_ID) {
    const newDate = new Date();
    newDate.setHours(newDate.getHours() + 49);

    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("refreshStorage")
        .setLabel("Odswież timer")
        .setStyle("PRIMARY")
    );

    newChannel.send({
      content:
        "Magazyn wygaśnie <t:" + parseInt(newDate.getTime() / 1000) + ":R>\n***Nie klikaj**, jeżeli nie odświeżyłeś magazynu w foxhole!*",
      components: [row],
    });

    channelListener(client);
  }
});

client.login(process.env.BOT_TOKEN);

process.on("uncaughtException", (err) => {
  console.error("There was an uncaught error", err);
  process.exit(1);
});
client.on('guildMemberAdd', async(member) => {
  const channel = await client.channels.fetch(process.env.LOG_CHANNEL_ID);

  channel.send('<@' + member.user.id + '> -> Do sprawdzenia');
});
client.on('guildMemberRemove', async(member) => {
  const channel = await client.channels.fetch(process.env.LOG_CHANNEL_ID);

  channel.send('Problem <@' + member.user.id + '> z głowy');
});