require("dotenv").config();
const { MessageButton, MessageActionRow } = require("discord.js");

const checkChannels = async (client, categoryChannels) => {

  for (const channel of categoryChannels.values()) {

    const roleToPing = process.env.LOGI_ROLE_ID;
    const currentTime = new Date();
    const TimeLimit = 10; // Time under which it will ping (in hours)
    const reminderCheckInterval = (TimeLimit + 1) * 60 * 60 * 10 * 100; // Time it will wait untill it pings again (in milliseconds)
    const reminderMessageContent = `<@&${roleToPing}> UWAGA: Magazyn wygasa za ok ${TimeLimit} godzin!`; // Reminder message content
    let lastReminderMessage = null;

    const messages = await channel.messages.fetch({ user: client.user.id });
    for (const message of messages.values()) {
      if (message.content.includes(reminderMessageContent)) {
        lastReminderMessage = message;
        break;
      }
    }

    if (lastReminderMessage) {
      const lastReminderTime = new Date(lastReminderMessage.createdTimestamp);
      if ((currentTime - lastReminderTime) < reminderCheckInterval) {
        continue;
      }
    }

    const oldestMessage = messages.last();
    const timeRegex = /<t:(\d+):R>/;
    const matches = oldestMessage.content.match(timeRegex);

    if (matches) {
      const timestamp = parseInt(matches[1]);
      const expirationDate = new Date(timestamp * 1000);
      const diffInHours = Math.abs(expirationDate - currentTime) / 36e5;

      if (diffInHours > 1 && diffInHours <= TimeLimit) {
        const sentMessage = await channel.send(reminderMessageContent);
      }
    }
  }
};

module.exports = { checkChannels };
