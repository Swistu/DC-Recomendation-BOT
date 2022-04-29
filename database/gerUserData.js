const { client, database } = require('./mongodb');

const getUserData = async (userID, data = []) => {
  try {
    await client.connect();
    const obj = {};

    if (typeof (data) === typeof ('string')) {
      Object.assign(obj, { [data]: 1 });
    }
    if (typeof (data) === typeof ([])) {
      data.forEach((element) => {
        Object.assign(obj, { [element]: 1 })
      });
    }

    const result = await database.collection("users").findOne(
      { userID: userID },
      { projection: { _id: 0, ...obj } }
    );

    if (result === null) {
      return {
        valid: false,
        errorMessage: "Nie znaleziono gracza w bazie danych.",
      };
    }
    if (!result) {
      return {
        valid: false,
        errorMessage: "Błąd podczas pobierania danych."
      };
    }

    return {
      valid: true,
      payLoad: {
        ...result
      }
    }

  } catch (e) {
    console.error(e);
    return {
      valid: false,
      errorMessage: "Błąd połączenia z bazą."
    };
  } finally {
    await client.close();
  }
}

exports.getUserData = getUserData;