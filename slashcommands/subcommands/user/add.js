const { getUserData } = require("../../../database/gerUserData");
const { getRankData } = require("../../../database/getRankData");
const { updateUser } = require("../../../database/updateUser");
const { getUserRoles } = require("../../../utility/getUserRoles");

const add = async (interaction) => {
  const user = await interaction.options.getMember('gracz');

  const userData = await getUserData(user.user.id);
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

      await updateUser(user.user.id, {
        $setOnInsert: {
          userID: user.user.id,
          discordTag: user.user.tag,
          currentNumber: 0,
          corps: rankData.payLoad.corps,
          number: rankData.payLoad.number,
          promotion: false,
          rank: rankData.payLoad.name,
          recommendations: [],
        }
      }, { upsert: true })
        .then(async () => {
          await interaction.editReply(`Dodano użytkownika <@${user.user.id}> do bazy.`);
        }).catch(async (err) => {
          console.error(err);
          await interaction.editReply(err);
        })

      return 0;
    } else {
      await interaction.editReply(userData.errorMessage);
      return 0;
    }
  }

  await interaction.editReply(`Użytkownik <@${user.user.id}> istnieje już w bazie.`);
};

module.exports = {
  add
};