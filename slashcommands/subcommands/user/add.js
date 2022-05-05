const { getUserData } = require("../../../database/gerUserData");
const { getRankData } = require("../../../database/getRankData");
const { updateUser } = require("../../../database/updateUser");
const { getUserRoles } = require("../../../utility/getUserRoles");
const { repair } = require("./repair");

const add = async (client, interaction) => {
  const user = await interaction.options.getMember('gracz');
  if (!user)
    return await interaction.editReply('Podano niewłaściwego gracza.');

  const userData = await getUserData(user.user.id);
  if (userData.valid)
    await interaction.editReply(`Użytkownik <@${user.user.id}> istnieje już w bazie.`);

  if (userData.errorMessage === `Nie znaleziono gracza <@${user.user.id}> w bazie danych.`) {
    const userRankRoles = await getUserRoles(user, "rank");
    if (!userRankRoles)
      return await interaction.editReply('Użytkownik nie ma nadanych ról.\nDodaj odpowiedni stopień/role użytkownikowi.');
    if (userRankRoles.length > 1)
      return await interaction.editReply('Użytkownik może posiadać tylko 1 stopień.');

    const rankData = await getRankData({ name: userRankRoles[0] })
    if (!rankData.valid)
      return await interaction.editReply(rankData.errorMessage);

    const result = await updateUser(user.user.id, {
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
    }, { upsert: true });
    if (!result.valid)
      return await interaction.editReply(result.errorMessage);

    return await repair(client, interaction, `Dodano użytkownika <@${user.user.id}> do bazy.\n`);
  } else
    return await interaction.editReply(userData.errorMessage);


};

module.exports = { add };