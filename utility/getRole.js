const constants = require("./constants");
require("dotenv").config();

const getRole = async (client, targetRole) => {
  const guild = await client.guilds.cache.get(process.env.DICORD_GUILD_ID);
  const role = await guild.roles.cache.find(role => role.name === targetRole);

  if (role)
    return role;

  return false;
}

module.exports = { getRole };

