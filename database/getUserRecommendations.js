const { client, database } = require('./mongodb');

const getUserRecommendations = async (userToCheck, negativeRecommend = false) => {
  try {
    await client.connect();

    let array = 'positiveRecommendations';
    if (negativeRecommend)
      array = 'negativeRecommendations';

    const result = await database.collection('users').findOne(
      { userID: userToCheck },
      { projection: { rankData: { [array]: 1 }, _id: 0 } }
    );

    if (!result)
      return { valid: false, errorMessage: `Nie znaleziono <@${userToCheck}> w bazie.` };
    if (typeof result.rankData[array] === typeof undefined)
      return { valid: false, errorMessage: `<@${userToCheck}> nie posiada${negativeRecommend ? ' ujemnych ' : ' '}rekomendacji.` };
    else
      if (result.rankData[array].length === 0)
        return { valid: false, errorMessage: `<@${userToCheck}> nie posiada${negativeRecommend ? ' ujemnych ' : ' '}rekomendacji.` };

    return { valid: true, payLoad: { [array]: result.rankData[array] } };
  } catch (e) {
    console.error(e);
    return { valid: false, errorMessage: 'Błąd połączenia z bazą' };
  } finally {
    await client.close();
  }
};

exports.getUserRecommendations = getUserRecommendations;


