const { getUserRoles } = require("../../../utility/getUserRoles");
const { getUserData } = require("../../../database/gerUserData");
const { getRankData } = require("../../../database/getRankData");
const { updateUser } = require("../../../database/updateUser");
const { getRole } = require("../../../utility/getRole");
const constants = require("../../../utility/constants");

const repair = async (client, interaction, message = '') => {
  await interaction.editReply('Trwa naprawiania gracza...');
  const user = await interaction.options.getMember('gracz');


  if (message === '')
    message = 'Bot naprawił:\n';

  if (!user) {
    await interaction.editReply('Nie udało sie pobrać danych gracza.');
    return 0;
  }

  const userData = await getUserData(user.user.id);

  // checking if we have user in database if not add one
  if (!userData.valid) {
    if (userData.errorMessage === `Nie znaleziono gracza <@${user.user.id}> w bazie danych.`) {
      const userRankRoles = await getUserRoles(user, "rank");

      if (!userRankRoles) {
        await interaction.editReply('Użytkownik nie ma nadanych ról.\nDodaj odpowiedni stopień/role użytkownikowi.');
        return 0;
      }

      if (userRankRoles.length > 1) {
        await interaction.editReply('Użytkownik może posiadać tylko 1 stopień.');
        return 0;
      }

      const rankData = await getRankData({ name: userRankRoles[0] })

      if (!rankData.valid) {
        await interaction.editReply(rankData.errorMessage);
        return 0;
      }

      const result = await updateUser(user.user.id, {
        $set: {
          userID: user.user.id,
          discordTag: user.user.tag,
          currentNumber: 0,
          corps: rankData.payLoad.corps,
          number: rankData.payLoad.number,
          promotion: false,
          rank: rankData.payLoad.name,
          recommendations: [],
        }
      }, { upsert: true });

      if (!result.valid) {
        await interaction.editReply(err);
        return 0;
      }
      message += 'Brak istnienia danych użytkownika w bazie\n';

      repair(client, interaction, message);

      return 0;
    } else {
      await interaction.editReply(userData.errorMessage);
      return 0;
    }
  }

  // Check if user is ready for promotion and repair any rank problems
  if (userData.payLoad.promotion) {
    const newRank = await getRankData({ number: userData.payLoad.number });

    if (!newRank.valid && newRank.errorMessage === 'Nie znaleziono rangi w bazie danych.') {
      if (userData.payLoad.currentNumber < 3) {
        await updateUser(userData.payLoad.userID, { $set: { promotion: false } });
        message += 'Fałszywie ustawioną promocje gracza na możliwą\n';
      } else {
        let newCorpsNumber;
        switch (userData.payLoad.corps) {
          case constants.CORPS.KORPUS_OFICEROW:
            newCorpsNumber = 5;
            break;
          case constants.CORPS.KORPUS_PODOFICEROW:
            if (userData.payLoad.rank === constants.RANKS.STARSZY_CHORAZY_SZTABOWY)
              newCorpsNumber = 5;
            newCorpsNumber = 4;
            break;
          case constants.CORPS.KORPUS_STRZELCOW:
            if (userData.payLoad.rank === constants.RANKS.PLUTONOWY)
              newCorpsNumber = 4;
            newCorpsNumber = 3;
            break;
          default:
            newCorpsNumber = false;
        }
        if (newCorpsNumber) {
          const curretRank = await getRankData({ name: userData.payLoad.rank });
          if (curretRank.valid) {
            const newPossibleRank = await getRankData({ number: curretRank.payLoad.number + newCorpsNumber });
            if (newPossibleRank.valid) {
              await updateUser(userData.payLoad.userID, { $set: { number: curretRank.payLoad.number + newCorpsNumber } });
              message += 'Błędną liczbę wszystkich rekomendacji\n';
            }
          }
        }
      }
    }
  }

  const userRoles = await getUserRoles(user);
  const unvalidRolesName = [];

  // Checking if user have correct roles on discord server
  if (userRoles) {
    if (!userRoles.find(role => role === userData.payLoad.rank)) {
      user.roles.add(await getRole(client, userData.payLoad.rank).catch((e) => console.error(e)));
      message += `Dodanie brakującego stopnia ${userData.payLoad.rank}\n`;
    }
    if (!userRoles.find(role => role === userData.payLoad.corps)) {
      user.roles.add(await getRole(client, userData.payLoad.corps).catch((e) => console.error(e)));
      message += `Dodanie brakującego korpusu ${userData.payLoad.corps}\n`;
    }

    for (const role of userRoles) {
      if (role === userData.payLoad.rank || role === userData.payLoad.corps) {
        continue;
      }

      unvalidRolesName.push(role);
    }

    if (unvalidRolesName.length > 0) {
      const unvalidRoles = [];

      for (const unvalidRole of unvalidRolesName) {
        unvalidRoles.push(await getRole(client, unvalidRole).catch((e) => console.error(e)));
      }

      if (unvalidRoles.length > 0) {
        for (const role of unvalidRoles)
          user.roles.remove(role).catch((e) => console.error(e));

        message += 'Usunięcie nieodpowiednich stopni użytkownikowi\n';
      }
    }
  } else {
    user.roles.add(await getRole(client, userData.payLoad.rank).catch((e) => console.error(e)));
    user.roles.add(await getRole(client, userData.payLoad.corps).catch((e) => console.error(e)));

    message += 'Dodanie odpowiednich stopni użytkownikowi.';
  }

  if (message === 'Bot naprawił:\n') {
    message = 'Bot nic nie naprawił :upside_down:\nIstnieje szansa, że bez sensu użyłeś tej komendy.';
  }

  await interaction.editReply(`\n\n${message}`);
}


module.exports = {
  repair
}