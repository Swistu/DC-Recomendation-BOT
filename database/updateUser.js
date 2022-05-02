const { client, database } = require('./mongodb');

const updateUser = async (userID, update = {}, options = {}) => {
  try {
    await client.connect();
    const result = await database.collection("users").updateOne(
      { userID: userID },
      update,
      options
    );

    if (result.matchedCount === 0 && result.upsertedCount === 0)
      return { valid: false, errorMessage: `Nie znaleziono ${userID} w bazie.` };
    if (result.modifiedCount === 0 && result.upsertedCount === 0)
      return { valid: false, errorMessage: `Znaleziono ${userID} w bazie, ale nie edytowano go.` };
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

exports.updateUser = updateUser;
