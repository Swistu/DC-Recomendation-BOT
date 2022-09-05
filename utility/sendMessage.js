const sendMessage = async (channelId, bot, fileName) => {
  const client = bot;
  const channel = await client.channels.fetch(channelId);
  const fullName = "./" + fileName + ".json";
  await channel.send({
    files: [fullName]
  });
}

exports.sendMessage = sendMessage;
