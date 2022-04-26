const { client, database } = require('./mongodb');

const getAllPromotionsList = async () => {
  try {
    await client.connect();

    const result = await database.collection("users").find(
      { promotion: true },
      { projection: { userID: 1, rank: 1, corps: 1, number: 1, _id: 0 } }
    );

    if (!await result.hasNext())
      return {
        valid: false,
        errorMessage: "Nie ma ludzi do awansowania"
      };

    const validUserList = [];
    const unvalidUserList = [];

    for await (const doc of result) {
      const newRank = await database.collection("ranking").findOne(
        { number: doc.number },
        { projection: { name: 1, _id: 0 } }
      );

      if (!newRank) {
        unvalidUserList.push({
          userID: doc.userID,
          corps: doc.corps,
          rank: doc.rank,
        });
        continue;
      }

      validUserList.push({
        userID: doc.userID,
        corps: doc.corps,
        rank: doc.rank,
        newRank: newRank.name
      });
    }

    return {
      valid: true,
      payLoad: {
        validUserList,
        unvalidUserList
      }
    };
  } catch (e) {
    console.error(e);
    return {
      valid: false,
      errorMessage: "Błąd połączenia z bazą"
    };
  } finally {
    await client.close();
  }
}

exports.getAllPromotionsList = getAllPromotionsList;