const fs = require("fs").promises;

const createJSONFile = async (data, fileName) => {
    return fs.writeFile(fileName, data, () => {
      console.log("Jest problem mordo");
    });
}

module.exports = { createJSONFile };