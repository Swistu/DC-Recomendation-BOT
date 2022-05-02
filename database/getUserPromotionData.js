const { client, database } = require('./mongodb');

const getUserPromotionData = async (userToPromote) => {
  try {
    await client.connect();

    const result = await database.collection("users").findOne(
      { promotion: true, userID: userToPromote.id },
      { projection: { userID: 1, rank: 1, corps: 1, number: 1, _id: 0 } }
    );
    if (!result)
      return { valid: false, errorMessage: `<@${userToPromote.id}> nie ma jeszcze awansu.` };

    const newRank = await database.collection("ranking").findOne(
      { number: result.number },
      { projection: { name: 1, corps: 1, _id: 0 } }
    );

    if (!newRank)
      return { valid: false, errorMessage: `Nie znaleziono nowego stopnia dla <@${userToPromote.id}>. \n` };

    return {
      valid: true,
      payLoad: {
        userID: result.userID,
        oldRank: result.rank,
        oldCorps: result.corps,
        newRank: newRank.name,
        newCorps: newRank.corps
      }
    };
  } catch (e) {
    console.error(e);
    return { valid: false, errorMessage: "Błąd połączenia z bazą" };
  } finally {
    await client.close();
  }
};

exports.getUserPromotionData = getUserPromotionData;
