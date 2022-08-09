require("dotenv").config();
const { client, database } = require('./mongodb');
const { createJSONFile } = require('../utility/createJSONFile');
const { sendMessage } = require("../utility/sendMessage");

const doBackup = async (bot) => {
    try {
        await client.connect();
        const db = await database.listCollections().toArray();
        await client.close();
        db.forEach(async (collInfo) => {
            await client.connect();
            const coll = await database.collection(collInfo.name).find().toArray();
            console.log(coll);
            await client.close();
        });
        
        //return;
        //const timestamp = Date.now().toString();
        //let i = 0;
        //db.forEach(async (collection) => {
        //    const collName = collection.collectionName.toString();
        //    console.log(i++, "_tutaj_", collection);
        //    const coll = await database.collection(collName).find().toArray();
        //    const json = JSON.stringify(coll, null, 2);
        //    const fileName = collName + "_" + timestamp;
        //    createJSONFile(json.toString(), fileName);
        //    sendMessage(process.env.BACKUP_CHANNEL_ID, bot, fileName);
        //});
        //return { valid: true, message: "Back się powiódł" };
    } catch (e) {
        console.error(e);
        //return { valid: false, message: "Błąd połączenia z bazą" };
    }// finally {
    //    await client.close();
    //}
}

exports.doBackup = doBackup;
