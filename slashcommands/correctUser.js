const { getUserData } = require("../database/gerUserData");
const { getRankData } = require("../database/getRankData");
const { updateUser } = require("../database/updateUser");
const { checkUserRoles } = require("../utility/checkUserRoles");
const constants = require("../utility/constants");
const { getRole } = require("../utility/getRole");


const run = async (client, interaction) => {
  await interaction.reply('Trwa naprawiania gracza...');
  const user = await interaction.options.getMember('nick');

  if (!user) {
    await interaction.editReply('Nie udało sie pobrać danych gracza.');
    return 0;
  }

  const userData = await getUserData(user.user.id);

  console.log('userData', userData);

  if (!userData.valid) {
    await interaction.editReply(userData.errorMessage);
    return 0;
  }

  if (userData.payLoad.promotion) {
    const newRank = await getRankData({ number: userData.payLoad.number });

    if (!newRank.valid && newRank.errorMessage === 'Nie znaleziono rangi w bazie danych.') {
      if (userData.payLoad.currentNumber < 3) {
        await updateUser(userData.payLoad.userID, { promotion: false });
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
              await updateUser(userData.payLoad.userID, { number: curretRank.payLoad.number + newCorpsNumber });
            }
          }
        }
      }
    }
  }

  const userRoles = await checkUserRoles(user);
  const unvalidRolesName = [];

  if (userRoles) {
    if (!userRoles.find(role => role === userData.payLoad.rank))
      user.roles.add(await getRole(client, userData.payLoad.rank).catch((e) => console.error(e)));
    if (!userRoles.find(role => role === userData.payLoad.corps))
      user.roles.add(await getRole(client, userData.payLoad.corps).catch((e) => console.error(e)));

    for (const role of userRoles) {
      if (role === userData.payLoad.rank || role === userData.payLoad.corps) {
        continue;
      }

      unvalidRolesName.push(role);
    }

    if (unvalidRolesName.length > 0) {
      const unvalidRoles = [];
      console.log("Invalid roles", unvalidRolesName);

      for (const unvalidRole of unvalidRolesName) {
        unvalidRoles.push(await getRole(client, unvalidRole).catch((e) => console.error(e)));
      }

      console.log('UnvalidRoles', unvalidRoles);
      if (unvalidRoles.length > 0) {
        for (const role of unvalidRoles)
          user.roles.remove(role).catch((e) => console.error(e));
      }
    }
  } else {
    user.roles.add(await getRole(client, userData.payLoad.rank).catch((e) => console.error(e)));
    user.roles.add(await getRole(client, userData.payLoad.corps).catch((e) => console.error(e)));
  }


  await interaction.editReply('Koniec naprawiania');
};

module.exports = {
  name: 'gracz',
  description: 'test',
  options: [
    {
      name: 'napraw',
      description: 'Naprawia rangi dla gracza.',
      type: 1,
      options: [
        {
          name: 'nick',
          description: 'Nick gracza do naprawy',
          type: 'USER',
          required: true,
        },
      ]
    }
  ],
  run,
};
