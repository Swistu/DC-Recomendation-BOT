const { checkPromotion } = require("../../../utility/checkPromotion");
const { recommendUser } = require("../../../database/recommendUser");
const { getUserData } = require("../../../database/getUserData");
const { updateUser } = require("../../../database/updateUser");
const constants = require("../../../utility/constants");
const { repair } = require("../user/repair");
const { degradeUser } = require("../../../utility/degradeUser");

const checkUserRoles = (recommender, recommended, negativeRecommend) => {
  const recommendedCorps = recommended.rankData.corps;
  const recommenderCorps = recommender.rankData.corps;
  const recommendedRank = recommended.rankData.rank;
  const recommenderRank = recommender.rankData.rank;

  if (negativeRecommend)
    if (
      [
        constants.RANKS.PODPULKOWNIK,
        constants.RANKS.PULKOWNIK,
        constants.RANKS.GENERAL,
      ].some((rank) => rank === recommenderRank)
    )
      return { valid: true };
    else
      return {
        valid: false,
        errorMessage: "Nie możesz dawać ujemnych rekomendacji.",
      };

  if (
    recommendedCorps !== constants.CORPS.KORPUS_OFICEROW &&
    recommendedCorps !== constants.CORPS.KORPUS_PODOFICEROW &&
    recommendedCorps !== constants.CORPS.KORPUS_STRZELCOW
  )
    return {
      valid: false,
      errorMessage: `<@${recommender.userID}> nie nalezy do żadnego korpusu`,
    };

  if (recommenderCorps === constants.CORPS.KORPUS_STRZELCOW)
    return {
      valid: false,
      errorMessage: `Twój korpus nie może dawać rekomendacji`,
    };

  if (recommenderCorps === recommendedCorps) {
    if (
      recommenderCorps === constants.CORPS.KORPUS_OFICEROW &&
      [
        constants.RANKS.PODPULKOWNIK,
        constants.RANKS.PULKOWNIK,
        constants.RANKS.GENERAL,
      ].some((rank) => rank === recommenderRank)
    )
      return { valid: true };
    return {
      valid: false,
      errorMessage: "Nie możesz rekomendować osoby z tego samego korpusu.",
    };
  }

  if (
    recommenderCorps === constants.CORPS.KORPUS_PODOFICEROW &&
    recommendedCorps === constants.CORPS.KORPUS_STRZELCOW
  ) {
    if (
      recommendedRank === constants.RANKS.PLUTONOWY &&
      recommenderCorps === constants.CORPS.KORPUS_PODOFICEROW
    )
      return {
        valid: false,
        errorMessage: "Nie możesz rekomendować tej osoby",
      };
    return { valid: true };
  }

  if (recommenderCorps === constants.CORPS.KORPUS_OFICEROW)
    return { valid: true };

  return { valid: false, errorMessage: "Nie możesz rekomendować tej osoby" };
};

const add = async (client, interaction) => {
  const memberRecommender = interaction.member;
  const memberRecommended = interaction.options.getMember("gracz");
  const negativeRecommend = interaction.options.getBoolean("ujemna");
  const reason = interaction.options.getString("powod");

  if (!memberRecommended || !memberRecommender)
    return await interaction.editReply("Niepoprawny gracz");

  const memberRecommendedResult = await getUserData(memberRecommended.user.id);
  const memberRecommenderResult = await getUserData(memberRecommender.user.id);
  if (!memberRecommendedResult.valid)
    return interaction.editReply(memberRecommendedResult.errorMessage);
  if (!memberRecommenderResult.valid)
    return interaction.editReply(memberRecommenderResult.errorMessage);

  const checkUserRanks = await checkUserRoles(
    memberRecommenderResult.payLoad,
    memberRecommendedResult.payLoad,
    negativeRecommend
  );
  if (!checkUserRanks.valid)
    return await interaction.editReply(checkUserRanks.errorMessage);

  await interaction.editReply("Dodaje rekomendacje ...");
  if (negativeRecommend === true) {
    const result = await recommendUser(
      memberRecommender.user.id,
      memberRecommended.user.id,
      reason,
      negativeRecommend
    );
    if (!result.valid) return await interaction.editReply(result.errorMessage);

    if (result.payLoad.rankData.promotion === true)
      if (
        !checkPromotion(
          result.payLoad.rankData.rank,
          result.payLoad.rankData.corps,
          result.payLoad.rankData.currentNumber
        )
      ) {
        const updatedUser = await updateUser(memberRecommended.user.id, {
          $set: { "rankData.promotion": false },
        });
        if (!updatedUser.valid)
          return await interaction.editReply(updatedUser.errorMessage);
      }

    await interaction.editReply(
      `<@${memberRecommended.user.id}> otrzymał ujemną rekomendacje od <@${memberRecommender.user.id}> powód:\n ${reason}`
    );
  } else {
    const result = await recommendUser(
      memberRecommender.user.id,
      memberRecommended.user.id,
      reason
    );
    if (!result.valid) {
      if (
        result.errorMessage ===
        `<@${memberRecommended.user.id}> już wcześniej otrzymał od Ciebie ${
          negativeRecommend ? "ujemna" : ""
        } rekomendacje.`
      ) {
        const message = await interaction.editReply(result.errorMessage);
        return message.react("🍄").catch((err) => console.error(err));
      }

      return await interaction.editReply(result.errorMessage);
    }

    if (
      checkPromotion(
        result.payLoad.rankData.rank,
        result.payLoad.rankData.corps,
        result.payLoad.rankData.currentNumber
      )
    ) {
      const updatedUser = await updateUser(memberRecommended.user.id, {
        $set: { "rankData.promotion": true },
      });

      if (!updatedUser.valid)
        return repair(
          client,
          interaction,
          `<@${memberRecommender.user.id}> rekomenduje <@${memberRecommended.user.id}> - ${reason}\n<@${memberRecommended.user.id}> jest gotowy do awansu ale nie udało mu sie ustawić odpowiedniej flagi. \nNastępuje próba naprawy.\n`
        );
    }

    await interaction.editReply(
      `<@${memberRecommender.user.id}> rekomenduje <@${memberRecommended.user.id}> - ${reason}`
    );
  }
};
module.exports = { add };
