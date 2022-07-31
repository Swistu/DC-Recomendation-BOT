const { getUserData } = require("../../../database/gerUserData");
const constants = require("../../../utility/constants");

const numberToPromote = (corps, rank) => {
  switch (corps) {
    case constants.CORPS.KORPUS_STRZELCOW:
      if (rank === constants.RANKS.PLUTONOWY)
        return number = '4';
      return number = '3';
    case constants.CORPS.KORPUS_PODOFICEROW:
      if (rank === constants.RANKS.STARSZY_CHORAZY_SZTABOWY)
        return number = '5';
      return number = '4';
    case constants.CORPS.KORPUS_OFICEROW:
      return number = '5';
  }

  return null;
};

const show = async (interaction) => {
  const user = interaction.options.getMember('gracz');
  if (!user)
    return await interaction.editReply('Podano niewłaściwego gracza.');

  const userData = await getUserData(user.user.id);
  if (!userData.valid)
    return await interaction.editReply(userData.errorMessage);

  let userRecommendations = '';
  if (typeof userData.payLoad.rankData.positiveRecommendations === typeof [])
    userData.payLoad.rankData.positiveRecommendations.forEach(element => {
      userRecommendations += `<@${element.userID}> - ${element.reason}\n`
    });
  if (userRecommendations === '')
    userRecommendations = 'Brak';

  let userNegativeRecommendations = '';
  if (typeof userData.payLoad.rankData.negativeRecommendations === typeof [])
    userData.payLoad.rankData.negativeRecommendations.forEach(element => {
      userNegativeRecommendations += `<@${element.userID}> - ${element.reason}\n`
    });
  if (userNegativeRecommendations === '')
    userNegativeRecommendations = 'Brak';

  const myEmbed = {
    color: '#0099ff',
    title: 'Dane gracza',
    description: `<@${user.user.id}>`,
    author: {
      name: `${user.user.username}#${user.user.discriminator}`,
      iconURL: `https://cdn.discordapp.com/avatars/${user.user.id}/${user.user.avatar}.jpeg`
    },
    thumbnail: { url: `https://cdn.discordapp.com/avatars/${user.user.id}/${user.user.avatar}.jpeg` },
    fields: [
      { name: 'Stopień:', value: `${userData.payLoad.rankData.rank}`, inline: true },
      { name: 'Korpus', value: `${userData.payLoad.rankData.corps}`, inline: true },
      { name: '\u200B', value: '\u200B' },
      { name: 'Rekomendacje:', value: userRecommendations },
      { name: 'Ujemne Rekomendacje:', value: userNegativeRecommendations },
      { name: 'Całkowita liczba rekomendacji', value: `${userData.payLoad.rankData.number}` },
      { name: 'Aktualna liczba ', value: `${userData.payLoad.rankData.currentNumber}`, inline: true },
      { name: 'Liczba do awansu', value: numberToPromote(userData.payLoad.rankData.corps, userData.payLoad.rankData.rank), inline: true },
      { name: 'Gotowy do awansu', value: userData.payLoad.rankData.promotion ? 'Tak' : 'Nie' },
    ],
  };

  await interaction.editReply({ content: 'Wynik', embeds: [myEmbed] });
};

module.exports = { show };
