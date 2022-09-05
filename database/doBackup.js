require("dotenv").config();
const { client, database } = require('./mongodb');
const { createJSONFile } = require('../utility/createJSONFile');
const { sendMessage } = require("../utility/sendMessage");

const doBackup = async (bot) => {
    try {
        var session = client.startSession();
        const db = await database.listCollections().toArray();
        const timestamp = Date.now().toString();
        db.forEach(async (collInfo) => {
            const coll = await database.collection(collInfo.name).find().toArray();
            const collName = collInfo.name.toString();
            const json = JSON.stringify(coll, null, 2);
            const fileName = collName + "_" + timestamp;
            createJSONFile(json.toString(), fileName);
            sendMessage(process.env.BACKUP_CHANNEL_ID, bot, fileName);
        });
        session.endSession();
    } catch (e) {
        console.error(e);
        //return { valid: false, message: "Błąd połączenia z bazą" };
    }
}

exports.doBackup = doBackup;
