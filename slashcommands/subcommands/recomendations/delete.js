const { getUserData } = require('../../../database/gerUserData');
const { getUserRecommendations } = require('../../../database/getUserRecommendations');
const { updateUser } = require('../../../database/updateUser');
const { checkPromotion } = require('../../../utility/checkPromotion');

const getUserRecommendationIndex = (userID, recommendationsArray = []) => {
  for (let i = 0; i < recommendationsArray.length; i++)
    if (recommendationsArray[i].userID === userID)
      return i;

  return null;
}

const delet = async (interaction) => {
  const memberRecommended = interaction.options.getMember('gracz');
  const memberRecommender = interaction.member;
  const negativeRecommend = interaction.options.getBoolean('ujemna');
  let recommendations = 'recommendations';
  if (negativeRecommend)
    recommendations = 'negativeRecommendations';

  if (!memberRecommended || !memberRecommender)
    return await interaction.editReply('Niepoprawny użytkownik.');

  const userData = await getUserData(memberRecommended.user.id, ['currentNumber', 'rank', 'corps']);
  if (!userData.valid)
    return await interaction.editReply(userData.errorMessage);

  const userRecommendationsResponse = await getUserRecommendations(memberRecommended.user.id, negativeRecommend);

  if (!userRecommendationsResponse.valid)
    return await interaction.editReply(userRecommendationsResponse.errorMessage);

  const recommendationIndex = getUserRecommendationIndex(memberRecommender.id, userRecommendationsResponse.payLoad[recommendations]);
  if (recommendationIndex === null)
    return await interaction.editReply(`<@${memberRecommended.user.id}> nie ma od Ciebie rekomendacji.`);

  let result;
  if (negativeRecommend) {
    const promotion = checkPromotion(userData.payLoad.rank, userData.payLoad.corps, userData.payLoad.currentNumber + 1);

    result = await updateUser(memberRecommended.user.id, {
      $inc: { number: 1, currentNumber: 1 },
      $pull: {
        [recommendations]: { userID: memberRecommender.id }
      },
      $set: {
        promotion: promotion
      }
    })
  }
  else {
    const promotion = checkPromotion(userData.payLoad.rank, userData.payLoad.corps, userData.payLoad.currentNumber - 1);

    result = await updateUser(memberRecommended.user.id, {
      $inc: { number: -1, currentNumber: -1 },
      $pull: {
        [recommendations]: { userID: memberRecommender.id }
      },
      $set: {
        promotion: promotion
      }
    })

    if (!result.valid)
      return await interaction.editReply(result.errorMessage);
  }


  await interaction.editReply(`Usunięto 1 rekomendacje graczowi <@${memberRecommended.user.id}>`);
};

module.exports = { delet };
