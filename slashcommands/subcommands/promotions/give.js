const { getAllPromotionsList } = require("../../../database/getAllPromotionsList");
const { getUserData } = require("../../../database/gerUserData");
const { promoteUser } = require("../../../utility/promoteUser");
const { updateUser } = require("../../../database/updateUser");
const constants = require("../../../utility/constants");

const repairUnvalidUsers = async (unvalidUsers) => {
  let errorMessage = '';

  for (const element of unvalidUsers) {
    await updateUser(element, { $set: { promotion: false } });
    errorMessage += `Nie znaleziono gracza <@${element}> na discordzie.\n`;
  }

  errorMessage += '\nKażdy gracz, który nie został znaleziony na discordzie został usunięty z możliwosci awansowania.\n';
  return errorMessage;
};

const promoteOneUser = async (interaction, userToPromote) => {
  await interaction.editReply("Trwa awansowanie gracza...");

  const promotedUser = await promoteUser(userToPromote);
  if (!promotedUser.valid)
    return await interaction.editReply(promotedUser.errorMessage);

  const message = `Awans przyznany: \n${promotedUser.payLoad.oldRank} <@${promotedUser.payLoad.userID}> awansuje na ${promotedUser.payLoad.newRank}`;

  await interaction.editReply(message);
};

const give = async (client, interaction) => {
  await interaction.editReply("Sprawdzam możliwość awansowania...");
  const userToPromote = await interaction.options.getMember('gracz');

  const userProvider = interaction.member;
  const providerRank = await getUserData(userProvider.id, "rank");
  if (!providerRank.valid)
    return await interaction.editReply(providerRank.errorMessage);
  if (![constants.RANKS.PODPULKOWNIK, constants.RANKS.PULKOWNIK, constants.RANKS.GENERAL].some(rank => rank === providerRank.payLoad.rank))
    return await interaction.editReply('Twój stopień nie pozwala na awansowanie graczy.');

  if (userToPromote)
    return promoteOneUser(interaction, userToPromote);

  await interaction.editReply("Trwa awansowanie graczy...");
  const userList = await getAllPromotionsList();
  if (!userList.valid)
    return await interaction.editReply(userList.errorMessage);
  if (userList.payLoad.validUserList.length === 0)
    return await interaction.editReply("Nie ma graczy, których można awansować.");

  const guildMembers = await client.guilds.cache.get(constants.GUILD_ID).members
  const responseList = [];
  const unvalidUsers = [];

  for (const element of userList.payLoad.validUserList) {
    const guildMember = await guildMembers.fetch(element.userID).catch(e => console.error(e));
    if (!guildMember) {
      unvalidUsers.push(element.userID);
      continue;
    }

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
  });

  if (unvalidUsers.length > 0)
    promotionUnapproved += await repairUnvalidUsers(unvalidUsers);
  if (promotionApproved === 'Lista zatwierdzonych awansów:\n')
    promotionApproved = 'Nikogo nie awansowano.\n';
  if (promotionUnapproved === 'Lista niezatwierdzonych awansów:\n')
    promotionUnapproved = ' ';

  await interaction.editReply(promotionApproved + "\n" + promotionUnapproved);
};

module.exports = { give };