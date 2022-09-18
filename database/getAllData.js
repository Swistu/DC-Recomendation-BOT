const { client, database } = require('./mongodb');
const { getCollectionsList } = require("./getCollectionsList")

const getAllData = async () => {
    const collections = [];
    const colls = await getCollectionsList();
    if (!colls.valid) {
        return { valid: false, message: colls.message };
    }
    const db = colls.payload;
    try {
        await client.connect();
        for (coll of db) {
            collections.push({ name: coll.name, data: await database.collection(coll.name).find().toArray() });
        }
        return { valid: false, payload: collections };
    } catch (e) {
        console.error(e);
        return { valid: false, message: "Błąd podczas pobierania bazy danych." };
    } finally {
        await client.close();
    }
};

exports.getAllData = getAllData;