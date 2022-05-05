const { getUserRecommendations } = require("../../../database/getUserRecommendations");

const show = async (interaction) => {
  const userToCheck = interaction.options.getMember("gracz");
  if (!userToCheck)
    return interaction.editReply('Niepoprawny użytkownik');

  const response = await getUserRecommendations(userToCheck.user.id);
  if (!response.valid)
    return await interaction.editReply(response.errorMessage);

  let message = `Rekomendacje gracza <@${userToCheck.user.id}> \n`;
  response.payLoad.recommendations.forEach(element => {
    message += `<@${element.userID}> - ${element.reason ? element.reason : "brak powodu"} \n`;
  });

  await interaction.editReply(message);
};

module.exports = { show };
