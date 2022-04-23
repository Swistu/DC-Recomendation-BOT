// const { MongoClient } = require('mongodb');
// require("dotenv").config();

// const showUser = async (database) => {
//   const users = database.collection("users");

//   const query = { discordTag: 'Świstu#3196' };
//   const user = await users.find(query);

//   console.log(user);
// }

// module.exports.recommendPlayer = async () => {
//   const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@discordbot.mqrll.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
//   const client = new MongoClient(uri);
//   const database = client.db("recomendationSystem");

//   try {
//     await client.connect();

//     console.log("dodano");
//   } catch (e) {
//     console.error();
//   } finally {
//     await client.close();
//   }


// }

// module.exports = async () => {
//   const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@discordbot.mqrll.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
//   const client = new MongoClient(uri);
//   const database = client.db("recomendationSystem");

//   try {
//     await client.connect();

//   } catch (e) {
//     console.error(e);
//   } finally {
//     await client.close();
//   }
// }

// // monbodb().catch(console.error);