const { client, database } = require('./mongodb');
const { canUserAddRecommendation } = require('./canUserAddRecommendation');
const { updateUser } = require('./updateUser');
const constants = require('../utility/constants');

const recommendUser = async (memberRecommender, memberRecommended, memberRank, korpusRekomendowanego, reason) => {
  const checkPromotion = async (currentNumber, promotion = false, rank) => {
    if (promotion === true)
      return true;

    switch (korpusRekomendowanego) {
      case constants.KORPUS_STRZELCOW:
        if (currentNumber >= 3)
          if (rank !== "Plutonowy")
            promotion = true;
          else if (currentNumber >= 4)
            promotion = true;
        break;
      case constants.KORPUS_PODOFICEROW:
        if (currentNumber >= 4)
          if (rank !== "Starszy Chorąży Sztabowy")
            promotion = true;
          else if (currentNumber >= 5)
            promotion = true;
        break;
      case constants.KORPUS_OFICEROW:
        if (currentNumber >= 5)
          promotion = true;
        break;
    }

    if (promotion === true)
      await updateUser(memberRecommended.user.id, { promotion: true });
    else
      return false;
  }

  try {
    const canRecommend = await canUserAddRecommendation(memberRecommender, memberRecommended);
    if (!canRecommend.valid)
      return {
        valid: false,
        errorMessage: canRecommend.errorMessage
      };

    await client.connect();

    const result = await database.collection("users").findOneAndUpdate(
      { userID: memberRecommended.user.id },
      {
        $setOnInsert: { discordTag: memberRecommended.user.tag, userID: memberRecommended.user.id, corps: korpusRekomendowanego, rank: memberRank, promotion: false },
        $inc: { number: 1, currentNumber: 1 },
        $push: {
          recommendations: {
            userID: memberRecommender.user.id,
            reason: reason
          }
        }
      },
      { upsert: true, returnDocument: "after" }
    )

    if (!result)
      return {
        valid: false,
        errorMessage: "Jakis błąd przy dodawaniu do serwera. Rekomendacja nie weszła"
      }

    if (result) {
      await checkPromotion(result.value.currentNumber, result.value.promotion, result.value.rank);
      return {
        valid: true
      };
    }

    return {
      valid: false,
      errorMessage: "Błąd przy pobieraniu/aktualizowaniu danych"
    }
  } catch (e) {
    console.error(e);
    return {
      valid: false,
      errorMessage: "Błąd przy połączeniu z bazą danych."
    };
  } finally {
    await client.close();
  }
}

exports.recommendUser = recommendUser;