const { getAllPromotionsList } = require("../../../database/getAllPromotionsList");
const { promoteUser } = require("../../../utility/promoteUser");
const constants = require("../../../utility/constants");

const promoteOneUser = async (interaction, userToPromote) => {
  await interaction.editReply("Sprawdzam awans...");

  const promotedUser = await promoteUser(userToPromote);
  if (!promotedUser.valid)
    return await interaction.editReply(promotedUser.errorMessage);

  const message = `Awans przyznany: \n${promotedUser.payLoad.oldRank} <@${promotedUser.payLoad.userID}> awansuje na ${promotedUser.payLoad.newRank}`;

  await interaction.editReply(message);
};

const give = async (client, interaction) => {
  const userToPromote = await interaction.options.getMember('gracz');

  if (userToPromote)
    return promoteOneUser(interaction, userToPromote);

  await interaction.editReply("Trwa awansowanie graczy...");

  const userList = await getAllPromotionsList();
  if (!userList.valid)
    return await interaction.editReply(userList.errorMessage);
  if (userList.payLoad.validUserList.length === 0)
    return await interaction.editReply("Nie ma graczy, których można awansować");

  const guildMembers = await client.guilds.cache.get(constants.GUILD_ID).members
  const responseList = [];

  for (const element of userList.payLoad.validUserList) {
    const guildMember = await guildMembers.fetch(element.userID).catch(e => console.error(e));
    if (!guildMember)
      continue;

    const data = await promoteUser(guildMember);
    responseList.push(data);
  }

  let promotionApproved = "Lista zatwierdzonych awansów:\n";
  let promotionUnapproved = "Lista niezatwierdzonych awansów:\n";
  let ncoCorps = false;
  let privateCorps = false;

  responseList.forEach((element) => {
    if (element.valid) {
      if (!ncoCorps && element.newCorps === constants.CORPS.KORPUS_PODOFICEROW) {
        promotionApproved += '\n';
        ncoCorps = true;
      }
      if (!privateCorps && element.newCorps === constants.CORPS.KORPUS_STRZELCOW) {
        promotionApproved += '\n';
        privateCorps = true;
      }
      promotionApproved += `${element.payLoad.oldRank} <@${element.payLoad.userID}> awansuje na ${element.payLoad.newRank}\n`;
    } else {
      promotionUnapproved += `${element.errorMessage}\n`;
    }
  })

  await interaction.editReply(promotionApproved + "\n" + promotionUnapproved);
};

module.exports = { give };