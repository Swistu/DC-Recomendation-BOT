const { getAllPromotionsList } = require('../../../database/getAllPromotionsList');
const constants = require('../../../utility/constants');

const show = async (interaction) => {
  await interaction.editReply("Sprawdzam awanse...");

  const response = await getAllPromotionsList();

  if (!response.valid) {
    await interaction.editReply(response.errorMessage);
    return;
  }

  let availablePromotions = "Lista graczy do awansu:\n\n";
  let unAvailablePromotions = "Lista graczy, którzy nie mogą dostać awansu z powodu niezgodności danych:\n\n";
  let ncoCorps = false;
  let privateCorps = false;

  response.payLoad.validUserList.forEach(element => {
    if (!ncoCorps && element.newCorps === constants.CORPS.KORPUS_PODOFICEROW) {
      availablePromotions += '\n';
      ncoCorps = true;
    }
    if (!privateCorps && element.newCorps === constants.CORPS.KORPUS_STRZELCOW) {
      availablePromotions += '\n';
      privateCorps = true;
    }
    availablePromotions += `${element.rank} <@${element.userID}> awansuje na ${element.newRank}\n`;
  });

  ncoCorps = false;
  privateCorps = false;

  response.payLoad.unvalidUserList.forEach(element => {
    if (!ncoCorps && element.newCorps === constants.CORPS.KORPUS_PODOFICEROW) {
      availablePromotions += '\n';
      ncoCorps = true;
    }
    if (!privateCorps && element.newCorps === constants.CORPS.KORPUS_STRZELCOW) {
      availablePromotions += '\n';
      privateCorps = true;
    }

    unAvailablePromotions += `${element.rank} <@${element.userID}>\n`;
  });

  await interaction.editReply(availablePromotions + "\n\n" + unAvailablePromotions);
};

module.exports = {
  show
};