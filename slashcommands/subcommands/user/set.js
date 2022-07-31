const { getUserData } = require("../../../database/gerUserData");
const { getRankData } = require("../../../database/getRankData");
const { updateUser } = require("../../../database/updateUser");
const { repair } = require("./repair");
const constants = require("../../../utility/constants");

const set = async (client, interaction) => {
  const userProvider = interaction.member;
  const providerRank = await getUserData(userProvider.id, "rankData");

  if (!providerRank.valid)
    return await interaction.editReply(providerRank.errorMessage);

  if (![constants.RANKS.PODPULKOWNIK, constants.RANKS.PULKOWNIK, constants.RANKS.GENERAL].some(rank => rank === providerRank.payLoad.rankData.rank))
    return await interaction.editReply('Twój stopień nie pozwala na ustawianie rang.');

  const user = interaction.options.getMember('gracz');
  const newRankName = interaction.options.getString('rank');

  if (!user)
    return await interaction.editReply('Podano niewłaściwego gracza.');
  if (!newRankName)
    return await interaction.editReply('Nie udało sie pobrać nazwy nowego stopnia.');

  const newRankData = await getRankData({ name: newRankName });
  if (!newRankData.valid)
    return await interaction.editReply(newRankData.errorMessage);

  const result = await updateUser(user.user.id, {
    $set: {
      rankData: {
        rank: newRankData.payLoad.name,
        corps: newRankData.payLoad.corps,
        number: newRankData.payLoad.number,
        currentNumber: 0,
        promotion: false,
        positiveRecommendations: [],
        negativeRecommendations: [],
      }
    }
  });

  if (!result.valid)
    return await interaction.editReply(result.errorMessage);

  repair(client, interaction, `Poprawnie zaktualizowano stopień <@${user.user.id}> w bazie.\nBot sam naprawił:\n\n`);
};

module.exports = { set };
