const sendFile = async (channelId, client, fileName) => {
  const channel = await client.channels.fetch(channelId);
  await channel.send({
    files: [fileName]
  });
}

exports.sendFile = sendFile;
