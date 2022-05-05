const { client, database } = require('./mongodb');

const getRankData = async (query = {}, projection = []) => {
  try {
    await client.connect();
    const projectionObj = {};

    if (typeof (projection) === typeof ('string'))
      Object.assign(projectionObj, { [projection]: 1 });
    if (typeof (projection) === typeof ([]))
      projection.forEach((element) => { Object.assign(projectionObj, { [element]: 1 }) });

    const result = await database.collection('ranking').findOne(
      { ...query },
      { projection: { _id: 0, ...projectionObj } }
    );

    if (result === null)
      return { valid: false, errorMessage: 'Nie znaleziono rangi w bazie danych.' };
    if (!result)
      return { valid: false, errorMessage: 'Błąd podczas pobierania danych.' };

    return { valid: true, payLoad: { ...result } };
  } catch (e) {
    console.error(e);
    return { valid: false, errorMessage: 'Błąd połączenia z bazą.' };
  } finally {
    await client.close();
  }
};

exports.getRankData = getRankData;
