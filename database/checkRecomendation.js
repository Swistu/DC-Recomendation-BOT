const { MongoClient } = require('mongodb');
const { setErrorMessage } = require('../helper/errorMessage');
require("dotenv").config();

const checkRecomendation = async (memberRecommender, memberRecommended) => {
  const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@discordbot.mqrll.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
  const client = new MongoClient(uri);
  const database = client.db("recomendationSystem");

  try {
    await client.connect();

    const result = await database.collection("users").findOne({ discordTag: memberRecommended });

    if (result === null)
      return true;
    if (result.promotion === true) {
      setErrorMessage("Gracz już ma awans");
      return false
    }
    if (result.recomendations.find(element => element.user === memberRecommender)) {
      setErrorMessage("Juz daleś rekomendacje temu graczowi");
      return false;
    }
    return true;

  } catch (e) {
    console.error(e);
    return false;
  } finally {
    await client.close();
  }
}

exports.checkRecomendation = checkRecomendation;