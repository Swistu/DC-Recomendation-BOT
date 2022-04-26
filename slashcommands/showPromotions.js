const { getAllPromotionsList } = require('../database/getAllPromotionsList');

const run = async (client, interaction) => {
  await interaction.reply("Sprawdzam awanse...")

  const response = await getAllPromotionsList();

  if (!response.valid) {
    await interaction.editReply(response.errorMessage);
    return;
  }

  let availablePromotions = "Lista graczy do awansu:\n\n";
  let unAvailablePromotions = "Lista graczy, którzy nie mogą dostać awansu z powodu niezgodności danych:\n\n";

  response.payLoad.validUserList.forEach(element => {
    availablePromotions += `${element.rank} <@${element.userID}> awansuje na ${element.newRank}\n`;
  });

  response.payLoad.unvalidUserList.forEach(element => {
    unAvailablePromotions += `${element.rank} <@${element.userID}>\n`;
  });
  
  await interaction.editReply(availablePromotions + "\n\n" + unAvailablePromotions);
}

module.exports = {
  name: "pokazawanse",
  description: "Pokazuje wszystkie nadchodzące awanse.",
  run
}