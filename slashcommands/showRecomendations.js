const { checkAllUserRecommendation } = require('../database/checkAllUserRecommendations.js');
const { getErrorMessage } = require('../helper/errorMessage');

const run = async ( interaction) => {
  let userToCheck = interaction.options.getMember("gracz");
  if (!userToCheck) return interaction.reply({ content: "Niepoprawny użytkownik", ephemeral: true })

  const response = await checkAllUserRecommendation(userToCheck);
  await interaction.reply( {content:"Sprawdzanie rekomendacji..."});

  if (response) {
    let message = `Rekomendacje gracza ${userToCheck} \n`;
    for (i = 0; i < response.length; i++) {
      message += `1x <@${response[i].userID}> - ${response[i].reason? response[i].reason: "brak powodu"} \n`;
    }
    await interaction.editReply({ content: message });
  }
  else
    await interaction.editReply({ content: 'Ten użytkownik nie ma rekomendacji albo inny error ¯\\_(ツ)_/¯' });
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