const { MongoClient } = require('mongodb');
require("dotenv").config();

const reccomendPlayer = async (memberRecommender, memberRecommended, reason) => {
  const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@discordbot.mqrll.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
  const client = new MongoClient(uri);
  const database = client.db("recomendationSystem");

  try {
    await client.connect();

    const result = await database.collection("Users").findOneAndUpdate({ discordTag: memberRecommended },
      {
        $setOnInsert: { "discordTag": memberRecommended },
        $inc: { number: 1 },
        $push: {
          recomendations: {
            user: memberRecommender,
            reason: reason
          }
        }
      }
      , { upsert: true })
      .then(() => true)
      .catch(() => false);


    return result;
  } catch (e) {
    console.error(e);
    return false;
  } finally {
    await client.close();
  }
}

exports.reccomendPlayer = reccomendPlayer;