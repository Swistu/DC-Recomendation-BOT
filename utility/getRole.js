const constants = require("./constants");

const getRole = async (client, targetRole) => {
  const guild = client.guilds.cache.get(constants.GUILD_ID);
  const role = await guild.roles.cache.find(role => role.name === targetRole);

  if (role)
    return role;

  return false;
}

module.exports = { getRole };

