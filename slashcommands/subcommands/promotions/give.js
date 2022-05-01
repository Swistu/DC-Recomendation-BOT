const { getAllPromotionsList } = require("../../../database/getAllPromotionsList");
const { promoteUser } = require("../../../utility/promoteUser");

const promoteOneUser = async (interaction, userToPromote) => {
  await interaction.editReply("Sprawdzam awans...");

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

const give = async (interaction) => {
  const userToPromote = await interaction.options.getMember('gracz');

  if (userToPromote) {
    promoteOneUser(interaction, userToPromote);
    return 0;
  }

  await interaction.editReply("Trwa awansowanie graczy...");
  const userList = await getAllPromotionsList();

  if (!userList.valid) {
    await interaction.editReply(userList.errorMessage);
    return;
  }
  if (userList.payLoad.validUserList.length === 0) {
    await interaction.editReply("Nie ma graczy, których można awansować");
    return;
  }

  const guildMembers = await client.guilds.cache.get("935268119365156884").members
  const responseList = [];

  for (const element of userList.payLoad.validUserList) {
    const guildMember = await guildMembers.fetch(element.userID);
    const data = await promoteUser(guildMember);

    responseList.push(data);
  }

  let promotionApproved = "";
  let promotionUnapproved = "";

  responseList.forEach((element) => {
    if (element.valid) {
      promotionApproved += `${element.payLoad.oldRank} <@${element.payLoad.userID}> awansuje na ${element.payLoad.newRank}\n`;
    } else {
      promotionUnapproved += `<@${element.payLoad.userID}> - ${element.errorMessage}\n`;
    }
  })

  await interaction.editReply(promotionApproved + "\n" + promotionUnapproved);
};

module.exports = {
  give
};