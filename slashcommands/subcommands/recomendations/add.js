const { checkPromotion } = require("../../../utility/checkPromotion");
const { recommendUser } = require("../../../database/recommendUser");
const { getUserData } = require("../../../database/gerUserData");
const { updateUser } = require("../../../database/updateUser");
const constants = require("../../../utility/constants");
const { repair } = require("../user/repair");
const { degradeUser } = require("../../../utility/degradeUser");

const checkUserRoles = (recommender, recommended, negativeRecommend) => {
  const recommendedCorps = recommended.corps;
  const recommenderCorps = recommender.corps;
  const recommendedRank = recommended.rank;
  const recommenderRank = recommender.rank;

  if (negativeRecommend)
    if ([constants.RANKS.PODPULKOWNIK, constants.RANKS.PULKOWNIK, constants.RANKS.GENERAL].some(rank => rank === recommenderRank))
      return { valid: true };
    else
      return { valid: false, errorMessage: 'Nie możesz dawać ujemnych rekomendacji.' };

  if (
    recommendedCorps !== constants.CORPS.KORPUS_OFICEROW &&
    recommendedCorps !== constants.CORPS.KORPUS_PODOFICEROW &&
    recommendedCorps !== constants.CORPS.KORPUS_STRZELCOW
  ) return { valid: false, errorMessage: `<@${recommender.userID}> nie nalezy do żadnego korpusu` };

  if (recommenderCorps === constants.CORPS.KORPUS_STRZELCOW)
    return { valid: false, errorMessage: `Twój korpus nie może dawać rekomendacji` };

  if (recommenderCorps === recommendedCorps) {
    if (
      recommenderCorps === constants.CORPS.KORPUS_OFICEROW &&
      [constants.RANKS.PODPULKOWNIK, constants.RANKS.PULKOWNIK, constants.RANKS.GENERAL].some(rank => rank === recommenderRank)
    ) return { valid: true };
    return { valid: false, errorMessage: 'Nie możesz rekomendować osoby z tego samego korpusu.' };
  }

  if (recommenderCorps === constants.CORPS.KORPUS_PODOFICEROW && recommendedCorps === constants.CORPS.KORPUS_STRZELCOW) {
    if (recommendedRank === constants.RANKS.PLUTONOWY && recommenderRank === constants.RANKS.SIERZANT)
      return { valid: false, errorMessage: 'Nie możesz rekomendować tej osoby' };
    else
      return { valid: true };
  }

  if (recommenderCorps === constants.CORPS.KORPUS_OFICEROW)
    return { valid: true };

  return { valid: false, errorMessage: 'Nie możesz rekomendować tej osoby' };
};

const add = async (client, interaction) => {
  const memberRecommender = interaction.member;
  const memberRecommended = interaction.options.getMember('gracz');
  const negativeRecommend = interaction.options.getBoolean('ujemna');
  const reason = interaction.options.getString('powod');

  if (!memberRecommended || !memberRecommender)
    return await interaction.editReply('Niepoprawny gracz');

  const memberRecommendedResult = await getUserData(memberRecommended.user.id);
  const memberRecommenderResult = await getUserData(memberRecommender.user.id);

  if (!memberRecommendedResult.valid) 
    return interaction.editReply(memberRecommendedResult.errorMessage);
  if (!memberRecommenderResult.valid) 
    return interaction.editReply(memberRecommenderResult.errorMessage);

  const checkUserRanks = await checkUserRoles(memberRecommenderResult.payLoad, memberRecommendedResult.payLoad, negativeRecommend);
  if (!checkUserRanks.valid)
    return await interaction.editReply(checkUserRanks.errorMessage);

  await interaction.editReply('Dodaje rekomendacje ...');
  if (negativeRecommend) {
    const result = await recommendUser(memberRecommender.user.id, memberRecommended.user.id, reason, negativeRecommend);
    if (!result.valid)
      return await interaction.editReply(result.errorMessage);

    if (result.payLoad.value.currentNumber < 0) {
      const degradedUser = await degradeUser(result.payLoad.value);
      if (!degradedUser.valid) {
        return await interaction.editReply(degradedUser.errorMessage);
      }

      const message = `Z powodu ujemnej rekomendacji gracza <@${memberRecommender.user.id}> ${degradedUser.payLoad.oldRank} <@${degradedUser.payLoad.userID}> został zdegradowany do stopnia ${degradedUser.payLoad.newRank}.\n\nNastąpi teraz nadanie odpowiednich ról.\n`; 
      return await repair(client, interaction, message);
    }

    await interaction.editReply(`<@${memberRecommended.user.id}> otrzymał ujemną rekomendacje od <@${memberRecommender.user.id}> powód:\n ${reason}`);
  } else {
    const result = await recommendUser(memberRecommender.user.id, memberRecommended.user.id, reason);
    if (!result.valid) {
      if (result.errorMessage === `<@${memberRecommended.user.id}> już wcześniej otrzymał od Ciebie rekomendacje.`) {
        const message = await interaction.editReply(result.errorMessage);
        return message.react('🍄').catch(err => console.error(err));
      }

      return await interaction.editReply(result.errorMessage);
    }

    if (checkPromotion(result.payLoad.rank, result.payLoad.corps, result.payLoad.currentNumber)) {
      const updatedUser = await updateUser(memberRecommended.user.d, { $set: { promotion: true } });
      if (!updatedUser.valid)
        return repair(client, interaction, `<@${memberRecommender.user.id}> rekomenduje <@${memberRecommended.user.id}> - ${reason}\n<@${memberRecommended.user.id}> jest gotowy do awansu ale nie udało mu sie ustawić odpowiedniej flagi. \nNastępuje próba naprawy.\n`);
    }

    await interaction.editReply(`<@${memberRecommender.user.id}> rekomenduje <@${memberRecommended.user.id}> - ${reason}`);
  }
};
module.exports = { add };
