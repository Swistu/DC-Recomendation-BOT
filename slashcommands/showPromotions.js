const { showPromotions } = require('../database/showPromotions');

const run = async (client, interaction) => {
  await interaction.reply("Sprawdzam awanse...")
  
  let response = await showPromotions();
  response = "Gracze, którzy otrzymują awans: \n" + response;

  await interaction.editReply(response);
}
module.exports = {
  name: "pokazawanse",
  description: "Pokazuje wszystkie nadchodzące awanse.",
  run
}