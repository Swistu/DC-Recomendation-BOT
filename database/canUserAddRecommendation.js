const { client, database } = require('./mongodb');

const canUserAddRecommendation = async (memberRecommender, memberRecommended) => {
  try {
    if (memberRecommender.user.id === memberRecommended.user.id) {
      return {
        valid: false,
        errorMessage: "Nie możesz dać rekomendacji sam sobie"
      }
    }
    await client.connect();

    const result = await database.collection("users").findOne({ userID: memberRecommended.user.id });

    if (result === null)
      return {
        valid: true
      }
    if (result.promotion === true) {
      return {
        valid: false,
        errorMessage: "Gracz już ma awans"
      }
    }
    if (result.recommendations.find(element => element.userID === memberRecommender.user.id)) {
      return {
        valid: false,
        errorMessage: "Juz daleś rekomendacje temu graczowi"
      }
    }

    return {
      valid: true,
    }
  } catch (e) {
    console.error(e);
    return {
      valid: false,
      errorMessage: "Błąd przy zapytaniu do bazy."
    }
  } finally {
    await client.close();
  }
}

exports.canUserAddRecommendation = canUserAddRecommendation;