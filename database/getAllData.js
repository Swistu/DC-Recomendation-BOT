const { client, database } = require('./mongodb');

const getAllData = async () => {
    try {
        await client.connect();
        const db = await database.collections();
        const coll = await database.collection("users").find().toArray();
        const output = JSON.stringify(coll, null, 2);
        //console.log(output);
        return output;
    } catch (e) {
        console.error(e);
        return { valid: false, errorMessage: "Błąd połączenia z bazą" };
    } finally {
        await client.close();
    }
}

exports.getAllData = getAllData;
