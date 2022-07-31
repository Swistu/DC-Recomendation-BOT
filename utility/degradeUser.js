const { getRankData } = require('../database/getRankData');
const { updateUser } = require('../database/updateUser');
const constants = require('./constants');

const degradeUser = async (userData) => {
  const currentRankData = await getRankData({ name: userData.rank });
  if (!currentRankData.valid)
    return { valid: false, errorMessage: currentRankData.errorMessage }

  let numberSubstracted = 0;
  switch (userData.corps) {
    case constants.CORPS.KORPUS_OFICEROW:
      numberSubstracted = 5;
      break;
    case constants.CORPS.KORPUS_PODOFICEROW:
      numberSubstracted = 4;
      break;
    case constants.CORPS.KORPUS_STRZELCOW:
      numberSubstracted = 3;
      break;
    default:
      numberSubstracted = false;
  }

  if (numberSubstracted === false)
    return { valid: false, errorMessage: `Nie udało sie ustalić nowej rangi dla <@${userData.userID}>.` };

  const newRankData = await getRankData({ number: currentRankData.payLoad.rankData.number - numberSubstracted });
  if (!newRankData.valid)
    return { valid: false, errorMessage: newRankData.errorMessage }


  const userUpdated = await updateUser(userData.userID, {
    $set: {
      rank: newRankData.payLoad.name,
      corps: newRankData.payLoad.rankData.corps,
      promotion: false,
      currentNumber: 0,
      recommendations: [],
      negativeRecommendations: []
    }
  });

  if (!userUpdated.valid)
    return { valid: false, errorMessage: `Błąd podczas aktualizowania danych <@${userData.userID}>. Degradacja nieudana.`, };

  return {
    valid: true,
    payLoad: {
      userID: userData.userID,
      oldRank: currentRankData.payLoad.name,
      oldCorps: currentRankData.payLoad.rankData.corps,
      newRank: newRankData.payLoad.name,
      newCorps: newRankData.payLoad.rankData.corps
    }
  }
};

module.exports = { degradeUser };
