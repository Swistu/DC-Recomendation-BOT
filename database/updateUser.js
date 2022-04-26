const { client, database } = require('./mongodb');

const updateUser = async (userID, updateFields = {}) => {
  try {
    await client.connect();

    const result = await database.collection("users").updateOne(
      { userID: userID },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      console.log("Updateuser0" + result);
      return Promise.reject(false);
    }
    if (result.modifiedCount === 0) {
      console.log("Updateuser0" + result);
      return Promise.reject(false);
    }

    console.log("Updateuser1" + result);
    return Promise.resolve(true);
  } catch (e) {
    console.error(e);
    return Promise.reject(false);
  } finally {
    await client.close();
  }
}

exports.updateUser = updateUser;