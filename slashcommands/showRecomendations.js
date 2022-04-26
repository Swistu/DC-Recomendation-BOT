const { getUserRecommendations } = require('../database/getUserRecommendations.js');

const run = async (client, interaction) => {
  let userToCheck = interaction.options.getMember("gracz");
  if (!userToCheck)
    return interaction.reply({ content: "Niepoprawny użytkownik", ephemeral: true })

  await interaction.reply({ content: "Sprawdzanie rekomendacji..." });
  const response = await getUserRecommendations(userToCheck);

  if (!response.valid) {
    await interaction.editReply({ content: response.errorMessage });
    return;
  }

  let message = `Rekomendacje gracza ${userToCheck} \n`;
  response.payLoad.recommendations.forEach( element => {
    message += `<@${element.userID}> - ${element.reason ? element.reason : "brak powodu"} \n`;
  });

  await interaction.editReply({ content: message });
}

module.exports = {
  name: 'pokazrekomendacje',
  description: "Pokazuje wszystkie rekomendacje gracza na aktualnym stopniu.",
  options: [
    {
      name: 'gracz',
      description: 'Nick gracza, którego chcesz sprawdzić.',
      type: 'USER',
      required: true,
    },
  ], run
}