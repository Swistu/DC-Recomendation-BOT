const fs = require("fs");

const createJSONFile = async (data, fileName) => {
    fs.writeFile("./" + fileName + ".json", data, (error) => {
      if (error != null) console.log(error);
    });
}

module.exports = { createJSONFile };