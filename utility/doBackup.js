require("dotenv").config();
const { createJSONFile } = require('./createJSONFile');
const { sendFile } = require("./sendFile");
const { getAllData} = require("../database/getAllData");

const doBackup = async (bot) => {
    const timestamp = Date.now();
    const fileNames = [];
    const collections = (await getAllData()).payload;
    try {
        for (coll of collections) {
            const fileName = coll.name + "_" + timestamp.toString() + ".json";
            fileNames.push(fileName);
            const json = JSON.stringify(coll.data, null, 2);
            await createJSONFile(json.toString(), fileName);
        }

        for (fileName of fileNames) {
            await sendFile(process.env.BACKUP_CHANNEL_ID, bot, fileName);
        }
        //easter egg
        const channel = await bot.channels.fetch(process.env.BACKUP_CHANNEL_ID);
        const today = new Date().toLocaleDateString();
        await channel.send("Backup danych z dnia " + today + ".\nWykonano w " + ((Date.now() - timestamp) * 0.001) + " sekund.");
        return { valid: true, message: "Backup zakończony!" };
    } catch (e) {
        console.error(e);
        return { valid: false, message: "Błąd połączenia z bazą mordo..." };
    }
};

exports.doBackup = doBackup;
