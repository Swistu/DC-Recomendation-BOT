const { client, database } = require('./mongodb');

const updateUser = async (userID, update = {}, options = {}) => {
  try {
    await client.connect();

    const result = await database.collection("users").updateOne(
      { userID: userID },
      update,
      options
    );

    if (result.matchedCount === 0 && result.upsertedCount === 0) {
      return Promise.reject("Nie znaleziono dokumentu");
    }
    if (result.modifiedCount === 0 && result.upsertedCount === 0) {
      console.log('result', result);
      return Promise.reject("Znaleziono dokument, ale nie zmodyfikowano");
    }

    return Promise.resolve("Poprawnie zmodyfikowano");
  } catch (e) {
    console.error(e);
    return Promise.reject(false);
  } finally {
    await client.close();
  }
}

exports.updateUser = updateUser;