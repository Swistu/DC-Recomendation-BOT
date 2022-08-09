const { createJSONFile } = require('../utility/createJSONFile');
const { client, database } = require('./mongodb');

const getAllData = async () => {
    try {
        await client.connect();
        const db = await (await database.collections());
        console.log(db);
        console.log("test");
        let collectionsCombined; 
        db.collections().forEach(collection => {
            const collName = collection.collectionName
            const coll = await database.collection().find().toArray();
            createJSONFile(coll, collName);
        });
        const coll = await database.collection("users").find().toArray();
        const output = JSON.stringify(db, null, 2);
        return output;
    } catch (e) {
        console.error(e);
        return { valid: false, errorMessage: "Błąd połączenia z bazą" };
    } finally {
        await client.close();
    }
}

exports.getAllData = getAllData;
