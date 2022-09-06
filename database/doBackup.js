require("dotenv").config();
const { client, database } = require('./mongodb');
const { createJSONFile } = require('../utility/createJSONFile');
const { sendFile } = require("../utility/sendFile");

const doBackup = async (bot) => {
    try {
        await client.connect();
        const session = client.startSession();
        const db = await database.listCollections().toArray();
        const collections = [];
        const fileNames = [];
        const timestamp = Date.now().toString();

        for (coll of db) {
            collections.push({name: coll.name, data: await database.collection(coll.name).find().toArray()});
        }

        for (coll of collections) {
            const fileName = coll.name + "_" + timestamp + ".json";
            fileNames.push(fileName);
            const json = JSON.stringify(coll.data, null, 2);
            await createJSONFile(json.toString(), fileName);
        }

        for (fileName of fileNames) {
            await sendFile(process.env.BACKUP_CHANNEL_ID, bot, fileName);
        }
        await session.endSession();
        //easter egg
        const channel = await bot.channels.fetch(process.env.BACKUP_CHANNEL_ID);
        await channel.send("Backupujemy tutaj! Jest dobrze w chuj!");
    } catch (e) {
        console.error(e);
        return { valid: false, message: "Błąd połączenia z bazą mordo..." };
    } finally {
        await client.close()
    }
    return { valid: true, message: "Backupujemy tutaj! Jest dobrze w chuj!" };
}

exports.doBackup = doBackup;
