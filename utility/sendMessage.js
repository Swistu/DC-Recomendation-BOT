const sendMessage = async (channelId, bot, timestamp) => {
  const { client } = bot;
  const channel = await client.channels.fetch(channelId);
  const filename = "./" + timestamp + ".json";
  await channel.send({
    files: [filename]
  });
}

exports.sendMessage = sendMessage;
