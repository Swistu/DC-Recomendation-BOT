const { MongoClient } = require('mongodb');

require("dotenv").config();

const showPromotions = async () => {
  const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@discordbot.mqrll.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
  const client = new MongoClient(uri);
  const database = client.db("recomendationSystem");

  try {
    await client.connect();

    const result = await database.collection("users").find(
      { promotion: true },
      { projection: { userID: 1, _id: 0 } }
    );

    let message = "";

    for await(const doc of result) {
      message += `<@${doc.userID}> \n`;
    }


    return message;
  } catch (e) {
    console.error(e);
    return false;
  } finally {
    await client.close();
  }
}

exports.showPromotions = showPromotions;