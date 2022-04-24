const { MongoClient } = require('mongodb');
const { setErrorMessage } = require('../helper/errorMessage');
require("dotenv").config();

const checkAllUserRecommendation = async (userToCheck) => {
  const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@discordbot.mqrll.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
  const client = new MongoClient(uri);
  const database = client.db("recomendationSystem");

  try {
    await client.connect();

    const result = await database.collection("users").findOne(
      { userID: userToCheck.id },
      { projection: { recomendations: 1, _id: 0} }
    );

    return result.recomendations;
  } catch (e) {
    console.error(e);
    return false;
  } finally {
    await client.close();
  }
}

exports.checkAllUserRecommendation = checkAllUserRecommendation;