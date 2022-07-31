const { client, database } = require('./mongodb');

const canUserAddRecommendation = async (recommenderID, recommendedID, negativeRecommend = false) => {
  try {
    if (recommenderID === recommendedID)
      return { valid: false, errorMessage: 'Nie możesz dać rekomendacji sam sobie' };

    await client.connect();
    const result = await database.collection('users').findOne({ userID: recommendedID });

    let array = 'positiveRecommendations';
    if (negativeRecommend)
      array = 'negativeRecommendations';

    if (result === null)
      return { valid: false, errorMessage: `Nie znaleziono <@${recommendedID}> w bazie.` };
    if (result.rankData.promotion === true && !negativeRecommend)
      return { valid: false, errorMessage: `<@${recommendedID}> już ma awans na wyższy stopień.` };
    if (result.rankData[array] !== undefined)
      if (result.rankData[array].find(element => element.userID === recommenderID))
        return { valid: false, errorMessage: `<@${recommendedID}> już wcześniej otrzymał od Ciebie ${negativeRecommend ? 'ujemna' : ''} rekomendacje.` };

    return { valid: true }
  } catch (e) {
    console.error(e);
    return { valid: false, errorMessage: 'Błąd przy zapytaniu do bazy.' };
  } finally {
    await client.close();
  }
};

exports.canUserAddRecommendation = canUserAddRecommendation;
