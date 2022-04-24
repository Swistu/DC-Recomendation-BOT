const { MongoClient } = require('mongodb');
const { setErrorMessage } = require('../helper/errorMessage');
const { checkRecomendation } = require('./checkRecomendation');
require("dotenv").config();

const KORPUS_STRZELCOW = "Korpus Strzelców";
const KORPUS_PODOFICEROW = "Korpus Podoficerów";
const KORPUS_OFICEROW = "Korpus Oficerów";

const recommendPlayer = async (memberRecommender, memberRecommended, memberRank, korpusRekomendowanego, reason) => {
  const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@discordbot.mqrll.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
  const client = new MongoClient(uri);
  const database = client.db("recomendationSystem");

  const checkPromotion = async (number, promotion = false, rank) => {
    if (promotion === true)
      return true;

    switch (korpusRekomendowanego) {
      case KORPUS_STRZELCOW:
        if (number >= 3)
          if (rank !== "Plutonowy")
            promotion = true;
          else if (number >= 4)
            promotion = true;
        break;
      case KORPUS_PODOFICEROW:
        if (number >= 4)
        if (rank !== "Starszy Chorąży sztabowy")
          promotion = true;
        else if (number >= 5)
          promotion = true;
      break;
      case KORPUS_OFICEROW:
        if (number >= 5)
          promotion = true;
      break;
    }

    if (promotion === true)
      await database.collection("users").updateOne(
        { userID: memberRecommended.user.id },
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
      { userID: memberRecommended.user.id },
      {
        $setOnInsert: { discordTag: memberRecommended.user.tag, userID: memberRecommended.user.id, corps: korpusRekomendowanego, rank: memberRank, promotion: false },
        $inc: { number: 1, currentNumber: 1 },
        $push: {
          recomendations: {
            userID: memberRecommender.user.id,
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
      await checkPromotion(result.number, result.promotion, result.rank);
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