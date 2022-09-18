const { getUserData } = require('../../../database/getUserData');
const { getUserRecommendations } = require('../../../database/getUserRecommendations');
const { updateUser } = require('../../../database/updateUser');
const { checkPromotion } = require('../../../utility/checkPromotion');

const getUserRecommendationIndex = (userID, recommendationsObject = {}) => {
  const objectKeys = Object.keys(recommendationsObject);

  for (let i = 0; i < recommendationsObject[objectKeys].length; i++)
    if (recommendationsObject[objectKeys][i].userID === userID)
      return i;

  return null;
}

const delet = async (interaction) => {
  const memberRecommended = interaction.options.getMember('gracz');
  const memberRecommender = interaction.member;
  const negativeRecommend = interaction.options.getBoolean('ujemna');
  let recommendations = 'rankData.positiveRecommendations';
  if (negativeRecommend)
    recommendations = 'rankData.negativeRecommendations';

  if (!memberRecommended || !memberRecommender)
    return await interaction.editReply('Niepoprawny użytkownik.');

  const userData = await getUserData(memberRecommended.user.id, 'rankData');
  if (!userData.valid)
    return await interaction.editReply(userData.errorMessage);

  const userRecommendationsResponse = await getUserRecommendations(memberRecommended.user.id, negativeRecommend);

  if (!userRecommendationsResponse.valid)
    return await interaction.editReply(userRecommendationsResponse.errorMessage);

  const recommendationIndex = getUserRecommendationIndex(memberRecommender.id, userRecommendationsResponse.payLoad);
  if (recommendationIndex === null)
    return await interaction.editReply(`<@${memberRecommended.user.id}> nie ma od Ciebie rekomendacji.`);

  let result;
  if (negativeRecommend) {
    const promotion = checkPromotion(userData.payLoad.rankData.rank, userData.payLoad.rankData.corps, userData.payLoad.rankData.currentNumber + 1);

    result = await updateUser(memberRecommended.user.id, {
      $inc: { 'rankData.number': 1, 'rankData.currentNumber': 1 },
      $pull: {
        [recommendations]: { userID: memberRecommender.id }
      },
      $set: {
        'rankData.promotion': promotion
      }
    })
  }
  else {
    const promotion = checkPromotion(userData.payLoad.rankData.rank, userData.payLoad.rankData.corps, userData.payLoad.rankData.currentNumber - 1);

    result = await updateUser(memberRecommended.user.id, {
      $inc: { 'rankData.number': -1, 'rankData.currentNumber': -1 },
      $pull: {
        [recommendations]: { userID: memberRecommender.id }
      },
      $set: {
        'rankData.promotion': promotion
      }
    })

    if (!result.valid)
      return await interaction.editReply(result.errorMessage);
  }


  await interaction.editReply(`Usunięto 1 ${negativeRecommend? 'ujemna': ''} rekomendacje graczowi <@${memberRecommended.user.id}>`);
};

module.exports = { delet };
