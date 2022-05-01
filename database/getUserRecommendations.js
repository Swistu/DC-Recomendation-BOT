const { client, database } = require('./mongodb');

const getUserRecommendations = async (userToCheck) => {
  try {
    await client.connect();

    const result = await database.collection('users').findOne(
      { userID: userToCheck.id },
      { projection: { recommendations: 1, _id: 0 } }
    );

    if (!result) {
      return {
        valid: false,
        errorMessage: `Nie znaleziono <@${userToCheck.id}> w bazie.`
      };
    }

    if (result.recommendations.length === 0) {
      return {
        valid: false,
        errorMessage: `<@${userToCheck.id}> nie posiada rekomendacji.`
      };
    }

    return {
      valid: true,
      payLoad: {
        recommendations: result.recommendations
      }
    };
  } catch (e) {
    console.error(e);
    return {
      valid: false,
      errorMessage: 'Błąd połączenia z bazą'
    };
  } finally {
    await client.close();
  }
}

exports.getUserRecommendations = getUserRecommendations;