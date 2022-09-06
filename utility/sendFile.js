const sendFile = async (channelId, bot, fileName) => {
  const client = bot;
  const channel = await client.channels.fetch(channelId);
  await channel.send({
    files: [fileName]
  });
}

exports.sendFile = sendFile;
