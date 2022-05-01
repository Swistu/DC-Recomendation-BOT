const { recommendUser } = require("../../../database/recommendUser");
const { getUserRoles } = require("../../../utility/getUserRoles");
const { getUserData } = require("../../../database/gerUserData");
const constants = require("../../../utility/constants");

const assaignReccomendation = async (interaction, recomenderCorps, recomendedCorps, memberRecommended, memberRecommender, reason) => {
  const memberRank = await getUserRoles(memberRecommended, 'rank');

  if (!memberRank) {
    await interaction.editReply('Rekomendowany nie posiada żadnego stopnia.');
    return 0;
  }
  if (memberRank.lenght > 1) {
    await interaction.editReply('Rekomendowany posiada za dużo stopni.');
    return 0;
  }

  try {
    await await interaction.editReply({ content: 'Sprawdzam rekomendacje ...', });
    const result = await recommendUser(memberRecommender, memberRecommended, memberRank, recomendedCorps, reason);

    if (!result.valid) {
      await interaction.editReply(result.errorMessage);
      return;
    }

    await interaction.editReply(
      `<@${interaction.user.id}> rekomenduje <@${memberRecommended.user.id}> - ${reason}`,
    );

  } catch (e) {
    await interaction.editReply('Wystąpił bład :(', e);
  }
}

const add = async (interaction) => {
  const memberRecommended = interaction.options.getMember('gracz');
  const memberRecommender = interaction.member;
  const reason = interaction.options.getString('powod');

  if (!memberRecommended || !memberRecommender)
    return await interaction.editReply('Niepoprawny użytkownik');

  const memberRecommendedResult = await getUserData(memberRecommended.user.id);
  const memberRecommenderResult = await getUserData(memberRecommender.user.id);

  if (!memberRecommendedResult.valid) {
    return interaction.editReply(memberRecommendedResult.errorMessage);
  }
  if (!memberRecommenderResult.valid) {
    return interaction.editReply(memberRecommenderResult.errorMessage);
  }

  const recomendedCorps = memberRecommendedResult.payLoad.corps;
  const recomenderCorps = memberRecommenderResult.payLoad.corps;
  const recomendedRank = memberRecommendedResult.payLoad.rank;
  const recomenderRank = memberRecommenderResult.payLoad.rank;

  if (recomendedCorps !== constants.CORPS.KORPUS_OFICEROW && recomendedCorps !== constants.CORPS.KORPUS_PODOFICEROW && recomendedCorps !== constants.CORPS.KORPUS_STRZELCOW)
    return await interaction.editReply({ content: 'Rekomendowany nie nalezy do żadnego korpusu', });

  if (recomenderCorps === constants.CORPS.KORPUS_STRZELCOW)
    return await interaction.editReply({ content: 'Twój korpus nie może dawać rekomendacji', });

  if (recomenderCorps === recomendedCorps) {
    if (recomenderCorps === constants.CORPS.KORPUS_OFICEROW && ['Podpułkownik', 'Pułkownik', 'Generał'].some(rank => rank === memberRecommenderResult.payLoad.rank))
      return assaignReccomendation(interaction, recomenderCorps, recomendedCorps, memberRecommended, memberRecommender, reason)
    return await interaction.editReply({ content: 'Nie możesz rekomendować osoby z tego samego korpusu.', })
  }

  if (recomenderCorps === constants.CORPS.KORPUS_PODOFICEROW && recomendedCorps === constants.CORPS.KORPUS_STRZELCOW) {
    if (recomendedRank === constants.RANKS.PLUTONOWY && recomenderRank === constants.RANKS.SIERZANT)
      return await interaction.editReply({ content: 'Nie możesz rekomendować tej osoby', })
    else
      return assaignReccomendation(interaction, recomenderCorps, recomendedCorps, memberRecommended, memberRecommender, reason)
  }

  if (recomenderCorps === constants.CORPS.KORPUS_OFICEROW) {
    return assaignReccomendation(interaction, recomenderCorps, recomendedCorps, memberRecommended, memberRecommender, reason)
  }

  return await interaction.editReply({ content: 'Nie możesz rekomendować tej osoby', })
};

module.exports = {
  add
};