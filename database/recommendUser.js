const { canUserAddRecommendation } = require('./canUserAddRecommendation');
const { client, database } = require('./mongodb');

const recommendUser = async (recommenderID, recommendedID, reason, negativeRecommend = false) => {
  try {
    const canRecommend = await canUserAddRecommendation(recommenderID, recommendedID, negativeRecommend);
    if (!canRecommend.valid)
      return { valid: false, errorMessage: canRecommend.errorMessage };

    let array = 'rankData.positiveRecommendations';
    if (negativeRecommend)
      array = 'rankData.negativeRecommendations'

    if (negativeRecommend)
      numberValue = -1;
    else
      numberValue = 1;

    await client.connect();
    const result = await database.collection('users').findOneAndUpdate(
      { userID: recommendedID },
      {
        $inc: { 'rankData.number': numberValue, 'rankData.currentNumber': numberValue },
        $push: {
          [array]: {
            userID: recommenderID,
            reason: reason,
            timestamp: Date.now()
          }
        }
      },
      { upsert: true, returnDocument: 'after' }
    );

    if (!result)
      return { valid: false, errorMessage: 'Błąd przy dodawaniu do serwera. Rekomendacja dla <@${recommendedID}> nie weszła' };
    if (result)
      return { valid: true, payLoad: result.value };

  } catch (e) {
    console.error(e);
    return { valid: false, errorMessage: 'Błąd przy połączeniu z bazą danych.' };
  } finally {
    await client.close();
  }
};

exports.recommendUser = recommendUser;
