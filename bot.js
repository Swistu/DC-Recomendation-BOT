const DiscordJS = require("discord.js");
const { getAllData } = require("./database/getAllData");
const { sendMessage } = require("./utility/sendMessage");
const { updateUser } = require("./database/updateUser");

require("dotenv").config();
const fs = require("fs");

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

  //Backup DB to channel only in production
  if (process.env.NODE_ENV !== "development") {
    const data = await getAllData();
    const timestamp = Date.now().toString();
    fs.writeFile("./" + timestamp + ".json", data, (error) => {
      console.log(error);
    });
    sendMessage(process.env.BACKUP_CHANNEL_ID, bot, timestamp);
  }
});

client.on("guildMemberRemove", async (member) => {
  console.log("testestets");
  await updateUser(member.user.id, { $set: { "accountActive": false } });
});

client.login(process.env.BOT_TOKEN);

process.on("uncaughtException", (err) => {
  console.error("There was an uncaught error", err);
  process.exit(1);
});
