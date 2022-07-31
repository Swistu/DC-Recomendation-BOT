const { client, database } = require('./mongodb');

const updateUserHistory = async (userID, rank, positiveRecommendations, negativeRecommendations) => {
  try {
    await client.connect();
    const result = await database.collection("recommendationsHistory").updateOne(
      { userID: userID },
      {
        $set: {
          [rank]: {
            positiveRecommendations,
            negativeRecommendations
          }
        },
        $push: {
          rankNames: rank
        }
      },
      { upsert: true }
    );

    if (result.matchedCount === 0 && result.upsertedCount === 0)
      return { valid: false, errorMessage: `Nie znaleziono ${userID} w bazie.` };
    if (result.modifiedCount === 0 && result.upsertedCount === 0)
      return { valid: false, errorMessage: `Znaleziono <@${userID}> w bazie, ale nie edytowano go.` };
    if (!result)
      return { valid: false, errorMessage: `Wystąpił podczas edytowania w bazie.` };

    return { valid: true, payLoad: result };
  } catch (e) {
    console.error(e);
    return { valid: false, errorMessage: 'Błąd połączenie z bazą danych.' };
  } finally {
    await client.close();
  }
};

exports.updateUserHistory = updateUserHistory;
