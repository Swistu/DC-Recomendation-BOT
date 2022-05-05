const { client, database } = require('./mongodb');

const getUserRecommendations = async (userToCheck, negativeRecommend = false) => {
  try {
    await client.connect();

    let array = 'recommendations';
    if (negativeRecommend)
      array = 'negativeRecommendations';

    const result = await database.collection('users').findOne(
      { userID: userToCheck },
      { projection: { [array]: 1, _id: 0 } }
    );

    if (!result)
      return { valid: false, errorMessage: `Nie znaleziono <@${userToCheck}> w bazie.` };
    if (typeof result[array] === typeof undefined)
      return { valid: false, errorMessage: `<@${userToCheck}> nie posiada${negativeRecommend ? ' ujemnych ' : ' '}rekomendacji.` };
    else
      if (result[array].length === 0)
        return { valid: false, errorMessage: `<@${userToCheck}> nie posiada${negativeRecommend ? ' ujemnych ' : ' '}rekomendacji.` };

    return { valid: true, payLoad: { [array]: result[array] } };
  } catch (e) {
    console.error(e);
    return { valid: false, errorMessage: 'Błąd połączenia z bazą' };
  } finally {
    await client.close();
  }
};

exports.getUserRecommendations = getUserRecommendations;


