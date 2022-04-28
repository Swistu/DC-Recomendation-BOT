const { promoteUser } = require("../utility/promoteUser");

const run = async (client, interaction) => {
  const userToPromote = interaction.options.getMember("gracz");

  await interaction.reply("Sprawdzam awans...");
  console.log(userToPromote);
  const promotedUser = await promoteUser(userToPromote);

  if (!promotedUser.valid) {
    await interaction.editReply(promotedUser.errorMessage);
    return;
  }

  const message = `Awans przyznany: \n
  ${promotedUser.payLoad.oldRank} <@${promotedUser.payLoad.userID}> awansuje na ${promotedUser.payLoad.newRank}
      `;

  await interaction.editReply(message);
}
module.exports = {
  name: "przyznajawansgraczowi",
  description: "Awansuje pojedynczego gracza.",
  options: [
    {
      name: 'gracz',
      description: 'Nick gracza, którego chcesz awansować.',
      type: 'USER',
      required: true,
    },
  ],
  run
}