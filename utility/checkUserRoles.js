const constants = require("./constants");

const checkUserRoles = async (member) => {
  const arr = [];

  const ranks = Object.values(constants.RANKS);
  const corps = Object.values(constants.CORPS);

  for (let i = 0; i < ranks.length; i++) {
    if (await member.roles.cache.some(role => role.name === ranks[i]))
      arr.push(ranks[i]);
  }
  for (let i = 0; i < corps.length; i++) {
    if (await member.roles.cache.some(role => role.name === corps[i]))
      arr.push(corps[i]);
  }
  if (arr.length > 0)
    return arr;

  return false;
};

module.exports = {
  checkUserRoles
};
