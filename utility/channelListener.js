require("dotenv").config();

const channelListener = async (client) => {
  const categoryChannels = client.channels.cache.filter(
    (channel) => channel.parentId === process.env.STORAGE_CHANNEL_ID
  );
  categoryChannels.forEach(async (channel) => {
    const collector = channel.createMessageComponentCollector();

    collector.on("collect", async (i) => {
      const refreshedDate = new Date();
      refreshedDate.setHours(refreshedDate.getHours() + 49);
      const fetchmessages = await channel.messages.fetch({
        after: 1,
        limit: 1,
      });
      const msg = fetchmessages.first();
      console.log("cokolwiek");
      await i.deferReply({
        ephemeral: true
      });
      await msg.edit("Magazyn wygaśnie <t:" + parseInt(refreshedDate.getTime() / 1000) + ":R>\n***Nie klikaj**, jeżeli nie odświeżyłeś magazynu w foxhole!*",);
      await i.editReply({
        content: 'Odświeżyłeś magazyn!',
        ephemeral: true
      })
    });

  });
};
module.exports = { channelListener };