const { MongoClient } = require("mongodb");
require("dotenv").config(); 

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@discordbot.mqrll.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri);
const database = client.db("recomendationSystem");

module.exports = {
  client,
  database
}