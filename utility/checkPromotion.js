const constants = require("./constants");

const checkPromotion = (rank, corps, currentNumber) => {
  let promotion = false;

  switch (corps) {
    case constants.CORPS.KORPUS_STRZELCOW:
      if (currentNumber >= 3)
        if (rank !== constants.RANKS.PLUTONOWY)
          promotion = true;
        else if (currentNumber >= 4)
          promotion = true;
      break;
    case constants.CORPS.KORPUS_PODOFICEROW:
      if (currentNumber >= 4)
        if (rank !== constants.RANKS.STARSZY_CHORAZY_SZTABOWY)
          promotion = true;
        else if (currentNumber >= 5)
          promotion = true;
      break;
    case constants.CORPS.KORPUS_OFICEROW:
      if (currentNumber >= 5)
        promotion = true;
      break;
  }
  return false;
};

module.exports = { checkPromotion };
