const { client, database } = require('./mongodb');

const canUserAddRecommendation = async (recommenderID, recommendedID) => {
  try {
    if (recommenderID === recommendedID)
      return { valid: false, errorMessage: 'Nie możesz dać rekomendacji sam sobie' };

    await client.connect();
    const result = await database.collection('users').findOne({ userID: recommendedID });

    if (result === null)
      return { valid: true };
    if (result.promotion === true)
      return { valid: false, errorMessage: `<@${recommendedID}> już ma awans na wyższy stopień.` };
    if (result.recommendations.find(element => element.userID === recommenderID))
      return { valid: false, errorMessage: `<@${recommendedID}> już wcześniej otrzymał od Ciebie rekomendacje.` };

    return { valid: true }
  } catch (e) {
    console.error(e);
    return { valid: false, errorMessage: 'Błąd przy zapytaniu do bazy.' };
  } finally {
    await client.close();
  }
};

exports.canUserAddRecommendation = canUserAddRecommendation;
