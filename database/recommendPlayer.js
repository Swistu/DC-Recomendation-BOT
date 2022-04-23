const { MongoClient } = require('mongodb');
const { setErrorMessage } = require('../helper/errorMessage');
const { checkRecomendation } = require('./checkRecomendation');
require("dotenv").config();

const KORPUS_SZEREGOWYCH = "Korpus Szeregowych";
const KORPUS_PODOFICEROW = "Korpus Podoficerów";
const KORPUS_OFICEROW = "Korpus Oficerów";

const recommendPlayer = async (memberRecommender, memberRecommended, korpusRekomendowanego, reason) => {
  const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@discordbot.mqrll.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
  const client = new MongoClient(uri);
  const database = client.db("recomendationSystem");

  const checkPromotion = async (number, promotion = false) => {
    if (promotion === true)
      return true;

    switch (korpusRekomendowanego) {
      case KORPUS_SZEREGOWYCH:
        if (number >= 3)
          promotion = true;
        break;
      case KORPUS_PODOFICEROW:
        if (number >= 4)
          promotion = true;
        break;
      case KORPUS_OFICEROW:
        if (number >= 5)
          promotion = true;
        break;
    }

    if (promotion === true)
      await database.collection("users").updateOne(
        { discordTag: memberRecommended },
        { $set: { promotion: true } }
      );
    else return false;
  }

  try {
    await client.connect();
    const canRecommend = await checkRecomendation(memberRecommender, memberRecommended);

    if (!canRecommend)
      return false;
    const result = await database.collection("users").findOneAndUpdate(
      { discordTag: memberRecommended },
      {
        $setOnInsert: { discordTag: memberRecommended, corps: korpusRekomendowanego, promotion: false },
        $inc: { number: 1 },
        $push: {
          recomendations: {
            user: memberRecommender,
            reason: reason
          }
        }
      },
      { upsert: true, returnDocument: "after" }
    )
      .then((res) => res.value)
      .catch(() => {
        setErrorMessage("Jakis błąd przy dodawaniu do serwera. Rekomendacja nie weszła");
      });


    if (result) {
      await checkPromotion(result.number, result.promotion);
      return true;
    }

    return false
  } catch (e) {
    console.error(e);
    return false;
  } finally {
    await client.close();
  }
}

exports.recommendPlayer = recommendPlayer;