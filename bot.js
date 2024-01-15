const { channelListener } = require("./utility/channelListener");
const { checkChannels } = require("./utility/cronOperations");
const { updateUser } = require("./database/updateUser");
const { doBackup } = require("./utility/doBackup");
const { MessageButton, MessageActionRow } = require("discord.js");
const DiscordJS = require("discord.js");
const cron = require("node-cron");
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
  channelListener(client);
  console.log(`Logged in as ${client.user.tag}!`);

  //Backup DB to channel only in production
  if (process.env.NODE_ENV !== "development") {
    // easter egg
    const channel = await client.channels.fetch(process.env.BACKUP_CHANNEL_ID);
    await channel.send("Pobrano jedną koszulkę z Town Halla.");

    const message = await doBackup(client);
    if (!message.valid) {
      console.log(message);
    }
  }

  cron.schedule("*/60 * * * * *", () => {
    try {
      checkChannels(client);
    } catch (error) {
      console.error("Error during scheduled channel check:", error);
    }
  });
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

    await newChannel.send({
      content:
        "Magazyn wygaśnie <t:" +
        parseInt(newDate.getTime() / 1000) +
        ":R>\n***Nie klikaj**, jeżeli nie odświeżyłeś magazynu w foxhole!*",
      components: [row],
    });

    const collector = newChannel.createMessageComponentCollector();

    collector.on("collect", async (i) => {
      const refreshedDate = new Date();
      refreshedDate.setHours(refreshedDate.getHours() + 49);
      const fetchmessages = await newChannel.messages.fetch({
        after: 1,
        limit: 1,
      });
      const msg = fetchmessages.first();
      await i.deferReply({
        ephemeral: true,
      });
      await msg.edit(
        "Magazyn wygaśnie <t:" +
          parseInt(refreshedDate.getTime() / 1000) +
          ":R>\n***Nie klikaj**, jeżeli nie odświeżyłeś magazynu w foxhole!*"
      );
      await i.editReply({
        content: "Odświeżyłeś magazyn!",
        ephemeral: true,
      });
    });
  }
});

client.login(process.env.BOT_TOKEN);

process.on("uncaughtException", (err) => {
  console.error("There was an uncaught error", err);
  process.exit(1);
});
client.on("guildMemberAdd", async (member) => {
  const channel = await client.channels.fetch(process.env.LOG_CHANNEL_ID);

  channel.send("<@" + member.user.id + "> -> Do sprawdzenia");
});
client.on("guildMemberRemove", async (member) => {
  const channel = await client.channels.fetch(process.env.LOG_CHANNEL_ID);

  channel.send("Problem <@" + member.user.id + "> z głowy");
});
