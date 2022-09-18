const { client, database } = require('./mongodb');

const getCollectionsList = async () => {
    try {
        await client.connect();
        const db = await database.listCollections().toArray();
        return { valid: true, payload: db };
    } catch (e) {
        console.error(e);
        return { valid: false, message: "Błąd podczas pobierania listy kolekcji." };
    } finally {
        await client.close();
    }
};

exports.getCollectionsList = getCollectionsList;