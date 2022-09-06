const fs = require("fs").promises;

const createJSONFile = async (data, fileName) => {
    const result = fs.writeFile(fileName, data, (error) => {
      console.log("Jest problem mordo");
    });
    return result
}

module.exports = { createJSONFile };