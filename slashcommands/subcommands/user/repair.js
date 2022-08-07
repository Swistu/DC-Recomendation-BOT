const { checkPromotion } = require("../../../utility/checkPromotion");
const { getUserRoles } = require("../../../utility/getUserRoles");
const { getUserData } = require("../../../database/gerUserData");
const { getRankData } = require("../../../database/getRankData");
const { updateUser } = require("../../../database/updateUser");
const { getRole } = require("../../../utility/getRole");
const constants = require("../../../utility/constants");

const repair = async (client, interaction, message = '') => {
  await interaction.editReply('Trwa naprawiania gracza...');
  const user = await interaction.options.getMember('gracz');

  if (!user)
    return await interaction.editReply('Nie udało sie pobrać danych gracza z discorda.');
  if (message === '')
    message = `Bot naprawił <@${user.user.id}>:\n`;

    
  // checking if we have user in database if not try to add one
  const userData = await getUserData(user.user.id);
  if (!userData.valid) {
    if (userData.errorMessage === `Nie znaleziono gracza <@${user.user.id}> w bazie danych.`) {
      const userRankRoles = await getUserRoles(user, "rank");

      if (!userRankRoles)
        return await interaction.editReply(`<@${user.user.id}> nie ma nadanych ról.\nDodaj odpowiedni stopień/role.`);
      if (userRankRoles.length > 1)
        return await interaction.editReply(`<@${user.user.id}> może posiadać tylko 1 stopień.`);

      const rankData = await getRankData({ name: userRankRoles[0] })
      if (!rankData.valid)
        return await interaction.editReply(rankData.errorMessage);

      const result = await updateUser(user.user.id, {
        $set: {
          userID: user.user.id,
          discordTag: user.user.tag,
          role: 'member',
          accountActive: true,
          rankData: {
            rank: rankData.payLoad.name,
            corps: rankData.payLoad.rankData.corps,
            number: rankData.payLoad.rankData.number,
            currentNumber: 0,
            promotion: false,
            negativeRecommendations: [],
            positiveRecommendations: [],
          }
        }
      }, { upsert: true });

      if (!result.valid) {
        message += result.errorMessage + "\n";
        return await interaction.editReply(message);
      }

      message += 'Brak istnienia danych użytkownika w bazie\n';
      return repair(client, interaction, message);
    } else {
      message += userData.errorMessage + "\n";
      return await interaction.editReply(message);
    }
  }

  //Check if account is active, if not then set to true
  if (userData.payLoad.accountActive == false) {
    const updateActivity = await updateUser(user.user.id, { $set: { "accountActive": true } });
    if (updateActivity.valid) {
      message += "Ustawiono konto jako aktywne.\n";
    }
  }

  // Check if user is ready for promotion and repair any rank problems
  if (userData.payLoad.rankData.promotion) {
    const newRank = await getRankData({ number: userData.payLoad.rankData.number });

    if (!newRank.valid) {
      if (newRank.errorMessage === 'Nie znaleziono rangi w bazie danych.') {
        if (checkPromotion(userData.payLoad.rankData.rank, userData.payLoad.rankData.corps, userData.payLoad.rankData.currentNumber) === false) {
          const updatedUser = await updateUser(userData.payLoad.userID, { $set: { 'rankData.promotion': false } });
          if (!updatedUser.valid)
            message += `<@${userData.payLoad.userID} ma fałszywie ustawiony awans ale wystąpił błąd podczas aktualizowania.\nPowód: ${updatedUser.errorMessage}\n`
          else
            message += `Wykryto fałszywie ustawiony awans gracza. <@${userData.payLoad.userID}> nie jest teraz na liście do awansowania.\n`;
        } else {
          let newCorpsNumber;
          switch (userData.payLoad.rankData.corps) {
            case constants.CORPS.KORPUS_OFICEROW:
              newCorpsNumber = 5;
              break;
            case constants.CORPS.KORPUS_PODOFICEROW:
              if (userData.payLoad.rankData.rank === constants.RANKS.STARSZY_CHORAZY_SZTABOWY)
                newCorpsNumber = 5;
              newCorpsNumber = 4;
              break;
            case constants.CORPS.KORPUS_STRZELCOW:
              if (userData.payLoad.rankData.rank === constants.RANKS.PLUTONOWY)
                newCorpsNumber = 4;
              newCorpsNumber = 3;
              break;
            default:
              newCorpsNumber = false;
          }
          if (newCorpsNumber) {
            const curretRank = await getRankData({ name: userData.payLoad.rankData.rank });
            if (curretRank.valid) {
              const newPossibleRank = await getRankData({ number: curretRank.payLoad.number + newCorpsNumber });
              if (newPossibleRank.valid) {
                const updatedUser2 = await updateUser(userData.payLoad.userID, { $set: { 'rankData.number': curretRank.payLoad.number + newCorpsNumber } });
                if (updatedUser2.valid)
                  message += `Poprawnie ustawiono nową liczbę wszystkich rekomedacji. <@${userData.payLoad.userID}> może teraz awansować\n`;
                else
                  message += `${userData.payLoad.userID} ma prawidłowo ustawiony awans ale nie udało sie naprawić całkowitej liczby rekomendacji\n Powód: ${updatedUser2.errorMessage}\n`;
              } else {
                if (newPossibleRank.errorMessage === 'Nie znaleziono rangi w bazie danych.') {
                  message += `Nie znaleziono nowej rangi dla gracza. Awans <@${userData.payLoad.userID}> został fałyszwie ustawiony. Próba naprawy\n`;
                  const updatedUser2 = await updateUser(userData.payLoad.userID, { $set: { 'rankData.promotion': false } });
                  if (!updatedUser2.valid)
                    message += `Nie udało sie ustawić promocji na fałsz.\nPowód: ${updatedUser2.errorMessage}\n`;

                  message += `Ustawiono awans <@${userData.payLoad.userID}> na fałsz.\n`;
                } else
                  message += `Błąd podczas pobierania nowej rangi dla <@${userData.payLoad.userID}> z bazy\n`;
              }
            } else {
              message += `Nie udało sie pobrać wszystkich danych odnośnie aktualnej rangi <@${userData.payLoad.userID}> aby sprawdzić czy jego awans jest słuszny.\n Powód nieudanego pobrania:${curretRank.errorMessage}\n`;
            }
          } else {
            message += `Nie udało się pobrać liczby wymaganej do awansu na kolejny stopień(<@${userData.payLoad.userID}> nie ma prawidłowego korpusu)\n`;
          }
        }
      } else
        message += newRank.errorMessage;
    }
  } else {
    if (checkPromotion(userData.payLoad.rankData.rank, userData.payLoad.rankData.corps, userData.payLoad.rankData.currentNumber)) {
      const updatedUser = await updateUser(userData.payLoad.userID, {
        $set: { 'rankData.promotion': false }
      });

      if (!updatedUser.valid)
        message += `<@${userData.payLoad.userID} powinien mieć awans ale wystąpił błąd podczas aktualizowania.\nPowód: ${updatedUser.errorMessage}\n`
      else
        message += `Naprawiono możliwość awansu. <@${userData.payLoad.userID}> jest teraz na liście do awansowania.\n`;
    }
  }

  const userRoles = await getUserRoles(user);
  const unvalidRolesName = [];

  // Checking if user have correct roles on discord server, add/remove incorrect one
  if (userRoles) {
    if (!userRoles.find(role => role === userData.payLoad.rankData.rank)) {
      await user.roles.add(await getRole(client, userData.payLoad.rankData.rank)
        .catch((e) => {
          console.error(e);
          message += `Nie udało sie pobrać nowej roli(${userData.payLoad.rankData.rank}) dla gracza z discorda\n`;
        }))
        .then(() => {
          message += `Dodanie brakującego stopnia ${userData.payLoad.rankData.rank}\n`;
        })
        .catch((e) => {
          console.error(e);
          message += `Nie udało sie ustawic nowej roli(${userData.payLoad.rankData.rank}) dla gracza na discordzie\n`;
        });
    }
    if (!userRoles.find(role => role === userData.payLoad.rankData.corps)) {
      await user.roles.add(await getRole(client, userData.payLoad.rankData.corps)
        .catch((e) => {
          console.error(e);
          message += `Nie udało sie pobrać nowej roli(${userData.payLoad.rankData.corps}) dla gracza z discorda\n`;
        }))
        .then(() => {
          message += `Dodanie brakującego korpusu ${userData.payLoad.rankData.corps}\n`;
        })
        .catch((e) => {
          console.error(e);
          message += `Nie udało sie ustawic nowej roli(${userData.payLoad.rankData.corps}) dla gracza na discordzie\n`;
        });
    }
    for (const role of userRoles) {
      if (role === userData.payLoad.rankData.rank || role === userData.payLoad.rankData.corps)
        continue;

      unvalidRolesName.push(role);
    }

    if (unvalidRolesName.length > 0) {
      const unvalidRoles = [];

      for (const unvalidRole of unvalidRolesName)
        unvalidRoles.push(await getRole(client, unvalidRole).catch((e) => console.error(e)));

      if (unvalidRoles.length > 0) {
        for (const role of unvalidRoles)
          await user.roles.remove(role).catch((e) => console.error(e));

        message += 'Usunięcie nieodpowiednich stopni użytkownikowi\n';
      }
    }
  } else {
    await user.roles.add(await getRole(client, userData.payLoad.rankData.rank).catch((e) => console.error(e)))
      .then(() => {
        message += `Dodanie stopnia ${userData.payLoad.rankData.rank}.\n`;
      })
      .catch(() => {
        message += `Nieudało sie ustawić stopnia ${userData.payLoad.rankData.rank} graczowi.\n`;
      });
    await user.roles.add(await getRole(client, userData.payLoad.rankData.corps).catch((e) => console.error(e)))
      .then(() => {
        message += `Dodanie stopnia ${userData.payLoad.rankData.corps}.\n`;
      })
      .catch(() => {
        message += `Nieudało sie ustawić stopnia ${userData.payLoad.rankData.corps} graczowi.\n`;
      });
  }

  if (message === `Bot naprawił <@${user.user.id}>:\n`)
    message = 'Bot nic nie naprawił :upside_down:\nIstnieje szansa, że bez sensu użyłeś tej komendy.';

  await interaction.editReply(`\n\n${message}`);
};


module.exports = { repair };
