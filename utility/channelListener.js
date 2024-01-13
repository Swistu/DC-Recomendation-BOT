require("dotenv").config();
const cron = require('node-cron');
const { MessageButton, MessageActionRow } = require("discord.js");

const channelListener = async (client) => {
  const categoryChannels = client.channels.cache.filter(
    (channel) => channel.parentId === process.env.STORAGE_CHANNEL_ID
  );

  const roleToPing = process.env.LOGI_ROLE_ID; // ID of the logistics role
  const reminderReaction = "⏰"; // Reaction that marks the reminder message

  categoryChannels.forEach(async (channel) => {
    const collector = channel.createMessageComponentCollector();

    collector.on("collect", async (i) => {
      const currentTime = Date.now();

      const refreshedDate = new Date();
      refreshedDate.setHours(refreshedDate.getHours() + 6);

      const messages = await channel.messages.fetch();
      for (const message of messages.values()) {
        if (message.author.id === client.user.id && message.reactions.cache.has(reminderReaction)) {
          await message.delete();
          continue;
        }
      }
      // console.log(channel.messages)
      const fetchmessages = await channel.messages.fetch({
        after: 1,
        limit: 1,
      });

      const row = new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId("refreshStorage")
          .setLabel("Odswież timer")
          .setStyle("PRIMARY")
          .setDisabled(true)
      );

      const msg = fetchmessages.first();
        try{
      await msg.edit({
        content:
          "Magazyn wygaśnie <t:" +
          parseInt(refreshedDate.getTime() / 1000) +
          ":R>\n***Nie klikaj**, jeżeli nie odświeżyłeś magazynu w foxhole!*",
        components: [row],
      });
      // console.log(msg.components[0])

      await i.deferReply({
        ephemeral: true
      });
      await i.editReply({
        content: 'Odświeżyłeś magazyn!',
        ephemeral: true
      })
      row.components[0].setDisabled(false)
      await msg.edit({
        content:
          "Magazyn wygaśnie <t:" +
          parseInt(refreshedDate.getTime() / 1000) +
          ":R>\n***Nie klikaj**, jeżeli nie odświeżyłeś magazynu w foxhole!*",
        components: [row],
      });
    } catch (error) {
        console.error(`Error checking messages in channel ${channel.id}: ${error}`);
    } finally {
      row.components[0].setDisabled(false);
      await msg.edit({
        content:
          "Magazyn wygaśnie <t:" +
          parseInt(refreshedDate.getTime() / 1000) +
          ":R>\n***Nie klikaj**, jeżeli nie odświeżyłeś magazynu w foxhole!*",
        components: [row],
      });
    }

    });
  });

  const checkChannels = async () => {
    for (const channel of categoryChannels.values()) {
      const currentTime = new Date();
      const TimeLimit = 9; // Time under which it will ping (in hours)
      const reminderCheckInterval = 20000 //TimeLimit * 60 * 60 * 10 * 100; // Time it will wait untill it pings again (in milliseconds)

      try {
        let lastReminderMessage = null;

        const messages = await channel.messages.fetch({ limit: 100 });
        for (const message of messages.values()) {
          if (message.author.id === client.user.id && message.reactions.cache.has(reminderReaction)) {
            lastReminderMessage = message;
            break;
          }
        }

        if (lastReminderMessage) {
          const lastReminderTime = new Date(lastReminderMessage.createdTimestamp);
          if ((currentTime - lastReminderTime) < reminderCheckInterval) {
            continue;
          }
          await lastReminderMessage.delete();
        }

        messages.forEach(async message => {
          const timeRegex = /<t:(\d+):R>/;
          const matches = message.content.match(timeRegex);
          if (matches) {
            const timestamp = parseInt(matches[1]);
            const expirationDate = new Date(timestamp * 1000);
            const diffInHours = Math.abs(expirationDate - currentTime) / 36e5;

            if (diffInHours <= TimeLimit) {
              const sentMessage = await channel.send(`<@&${roleToPing}> UWAGA: Magazyn wygasa za ok ` + (TimeLimit - 1) + ` godzin!`);
              await sentMessage.react(reminderReaction);
            }
          }
        });
      } catch (error) {
        console.error(`Error checking messages in channel ${channel.id}: ${error}`);
      }
    }
  };

  cron.schedule('*/10 * * * * *', () => {
    console.log("check")
    checkChannels();
  });
};

module.exports = { channelListener };


//for na filter
//usun usuwanie wiadomości, jedyne usuwanie przy przycisku
//cron może działać co minut
//cronOperation wystartować w bot.js
//opcja first message
//reminder action
//