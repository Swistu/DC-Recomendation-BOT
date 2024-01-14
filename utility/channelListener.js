const { MessageButton, MessageActionRow } = require("discord.js");
require("dotenv").config();

const channelListener = async (client) => {
  const categoryChannels = client.channels.cache.filter(
    (channel) => channel.parentId === process.env.STORAGE_CHANNEL_ID
  );
  const reminderMessageRegex = new RegExp(`UWAGA: Magazyn wygasa za ok \\d+ godzin!`);

  categoryChannels.forEach(async (channel) => {
    const collector = channel.createMessageComponentCollector();

    collector.on("collect", async (i) => {
      const currentTime = Date.now();

      const refreshedDate = new Date();
      refreshedDate.setHours(refreshedDate.getHours() + 49);

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
      try {
        await msg.edit({
          content:
            "Magazyn wygaśnie <t:" +
            parseInt(refreshedDate.getTime() / 1000) +
            ":R>\n***Nie klikaj**, jeżeli nie odświeżyłeś magazynu w foxhole!*",
          components: [row],
        });

        await i.deferReply({
          ephemeral: true
        });

        do {
          fetched = await channel.messages.fetch({ limit: 100 , user: client.user.id});
          const messagesToDelete = fetched.filter(message =>
            reminderMessageRegex.test(message.content));

          if (messagesToDelete.size > 0) {
            for (const message of messagesToDelete.values()) {
              await message.delete();
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }
        } while (fetched.size >= 100);

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
};

module.exports = { channelListener };