const { getUserPromotionData } = require('../database/getUserPromotionData');
const { updateUser } = require('../database/updateUser');

const promoteUser = async (user) => {
  const response = await getUserPromotionData(user);

  if (!response.valid)
    return { valid: false, errorMessage: response.errorMessage };

  const oldRole = user.roles.cache.find(role => role.name === response.payLoad.oldRank);
  const oldCorpsRole = user.roles.cache.find(role => role.name === response.payLoad.oldCorps);
  const newRole = user.guild.roles.cache.find(role => role.name === response.payLoad.newRank);
  const newCorpsRole = user.guild.roles.cache.find(role => role.name === response.payLoad.newCorps);

  if (!oldRole || !oldCorpsRole || !newRole || !newCorpsRole)
    return {
      valid: false,
      errorMessage: `Błąd podczas wczytywania korpusu lub stopnia dla gracza <@${user.user.id}>
      Przewidywane dane 
      Aktualny stopień: ${response.payLoad.oldRank} - ${response.payLoad.oldCorps}
      Nowy stopień: ${response.payLoad.newRank} - ${response.payLoad.newCorps}
      `,
      payLoad: {
        userID: user.user.id
      }
    };


  const userUpdated = await updateUser(user.user.id, {
    $set: {
      rank: response.payLoad.newRank,
      corps: response.payLoad.newCorps,
      promotion: false,
      currentNumber: 0,
      recommendations: [],
      negativeRecommendations: []
    }
  });

  if (!userUpdated.valid)
    return {
      valid: false,
      errorMessage: `Błąd podczas aktualizowania danych <@${user.user.id}>. Awans nie uznany.`,
      payLoad: {
        userID: user.user.id,
      }
    }

  user.roles.remove(oldRole).catch((e) => { console.error(e) });
  user.roles.add(newRole).catch((e) => { console.error(e) });
  user.roles.remove(oldCorpsRole).catch((e) => { console.error(e) });
  user.roles.add(newCorpsRole).catch((e) => { console.error(e) });

  return {
    valid: true,
    payLoad: {
      userID: user.user.id,
      oldRank: response.payLoad.oldRank,
      oldCorps: response.payLoad.oldCorps,
      newRank: response.payLoad.newRank,
      newCorps: response.payLoad.newCorps
    }
  }
};

module.exports = { promoteUser };
