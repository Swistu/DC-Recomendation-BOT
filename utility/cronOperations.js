require("dotenv").config();
const Discord = require("discord.js");

const checkChannels = async (client) => {
  const categoryChannels = client.channels.cache.filter(
    (channel) => channel.parentId === process.env.STORAGE_CHANNEL_ID
  );
  for (const channel of categoryChannels.values()) {
    try {
      const roleToPing = process.env.LOGI_ROLE_ID;
      const currentTime = new Date();
      const TimeLimit = 10; // Time under which it will ping (in hours)
      const reminderCheckInterval = (TimeLimit + 1) * 60 * 60 * 10 * 100; // Time it will wait untill it pings again (in milliseconds)
      const reminderMessagePattern = `<@&${roleToPing}> UWAGA: Magazyn wygasa`; // Pattern to identify reminder messages

      let lastReminderMessage = null;

      const messages = await channel.messages.fetch({ user: client.user.id });
      for (const message of messages.values()) {
        if (message.content.startsWith(reminderMessagePattern)) {
          lastReminderMessage = message;
          break;
        }
      }

      if (lastReminderMessage) {
        const lastReminderTime = new Date(lastReminderMessage.createdTimestamp);
        if (currentTime - lastReminderTime < reminderCheckInterval) {
          continue;
        }
      }

      const oldestMessage = messages.last();
      const timeRegex = /<t:(\d+):R>/;
      const matches = oldestMessage.content.match(timeRegex);

      if (matches) {
        const timestamp = parseInt(matches[1]);
        const expirationDate = new Date(timestamp * 1000);
        const diffInHours = (expirationDate - currentTime) / 36e5;

        const reminderMessageContent = `${reminderMessagePattern} za <t:${timestamp}:R>!`;
        if (diffInHours > 1 && diffInHours <= TimeLimit) {
          await channel.send(reminderMessageContent);
        }
      }
    } catch (error) {
      if (error instanceof Discord.DiscordAPIError && error.code === 10003) {
        console.error(`Channel not found or inaccessible: ${channel.id}`);
        continue; 
      } else {
        console.error(
          `Error checking messages in channel ${channel.id}: ${error}`
        ); 
      }
    } 
  }
};

module.exports = { checkChannels };
