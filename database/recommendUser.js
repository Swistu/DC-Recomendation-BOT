const { canUserAddRecommendation } = require('./canUserAddRecommendation');
const { client, database } = require('./mongodb');

const recommendUser = async (recommenderID, recommendedID, reason, negativeRecommend = false) => {
  try {
    const canRecommend = await canUserAddRecommendation(recommenderID, recommendedID, negativeRecommend);
    if (!canRecommend.valid)
      return { valid: false, errorMessage: canRecommend.errorMessage };

    let array = 'recommendations';
    if (negativeRecommend)
      array = 'negativeRecommendations'

    if (negativeRecommend)
      numberValue = -1;
    else
      numberValue = 1;

    await client.connect();
    const result = await database.collection('users').findOneAndUpdate(
      { userID: recommendedID },
      {
        $inc: { number: numberValue, currentNumber: numberValue },
        $push: {
          [array]: {
            userID: recommenderID,
            reason: reason
          }
        }
      },
      { upsert: true, returnDocument: 'after' }
    );

    if (!result)
      return { valid: false, errorMessage: 'Błąd przy dodawaniu do serwera. Rekomendacja dla <@${recommendedID}> nie weszła' };
    if (result)
      return { valid: true, payLoad: result };

  } catch (e) {
    console.error(e);
    return { valid: false, errorMessage: 'Błąd przy połączeniu z bazą danych.' };
  } finally {
    await client.close();
  }
};

exports.recommendUser = recommendUser;
