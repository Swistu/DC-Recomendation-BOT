require("dotenv").config();
const DiscordJS = require("discord.js");
const { doBackup } = require("./database/doBackup");
const { updateUser } = require("./database/updateUser");

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
    createJSONFile
  if (slashcmd.perms && !interaction.member.permissions.has(slashcmd.perm))
    return interaction.reply("Nie masz uprawnień do tej komendy");

  slashcmd.run(client, interaction);
});

client.on("ready", async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  const message = await doBackup(client);
  console.log(message.message);
});

client.on("guildMemberRemove", async (member) => {
  await updateUser(member.user.id, { $set: { "accountActive": false } });
});

client.login(process.env.BOT_TOKEN);

process.on("uncaughtException", (err) => {
  console.error("There was an uncaught error", err);
  process.exit(1);
});
