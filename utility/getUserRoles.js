const constants = require('./constants');

const getUserRoles = async (member, roleType = '') => {
  const ranks = Object.values(constants.RANKS);
  const corps = Object.values(constants.CORPS);
  const arr = [];

  if (roleType === 'rank' || roleType === '')
    for (let i = 0; i < ranks.length; i++)
      if (await member.roles.cache.some(role => role.name === ranks[i]))
        arr.push(ranks[i]);

  if (roleType === 'corps' || roleType === '')
    for (let i = 0; i < corps.length; i++)
      if (await member.roles.cache.some(role => role.name === corps[i]))
        arr.push(corps[i]);

  if (arr.length > 0)
    return arr;

  return null;
};

module.exports = { getUserRoles };

