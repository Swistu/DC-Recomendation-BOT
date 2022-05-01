const { getUserRecommendations } = require('../../../database/getUserRecommendations');
const { updateUser } = require('../../../database/updateUser');

const getUserRecommendationIndex = (userID, recommendationsArray = []) => {
  for (let i = 0; i < recommendationsArray.length; i++) {
    if (recommendationsArray[i].userID === userID)
      return i;
  }

  return null;
}

const delet = async (interaction) => {
  const memberRecommended = interaction.options.getMember('gracz');
  const memberRecommender = interaction.member;
  if (!memberRecommended || !memberRecommender)
    return await interaction.editReply('Niepoprawny użytkownik.');

  const userRecommendationsResponse = await getUserRecommendations(memberRecommended.user);
  if (!userRecommendationsResponse.valid)
    return await interaction.editReply(userRecommendationsResponse.errorMessage);

  const recommendationIndex = getUserRecommendationIndex(memberRecommender.id, userRecommendationsResponse.payLoad.recommendations);
  if (recommendationIndex === null) {
    return await interaction.editReply(`<@${memberRecommended.user.id}> nie ma od Ciebie rekomendacji.`);
  }

  const result = await updateUser(memberRecommended.user.id, {
    $inc: { number: -1, currentNumber: -1 },
    $pull: {
      recommendations: { userID: memberRecommender.id }
    },
    $set: {
      promotion: false
    }
  })

  if (!result.valid) {
    await interaction.editReply(result.errorMessage);
    return;
  }

  await interaction.editReply(`Usunięto 1 rekomendacje graczowi <@${memberRecommended.user.id}>`);
};

module.exports = {
  delet
};