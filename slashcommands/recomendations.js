const { add } = require('./subcommands/recomendations/add.js');
const { delet } = require('./subcommands/recomendations/delete.js');
const { show } = require('./subcommands/recomendations/show.js');

const run = async (client, interaction) => {
  await interaction.reply('Trwa sprawdzanie rekomendacji...');

  switch (await interaction.options.getSubcommand()) {
    case 'dodaj':
      add(client, interaction);
      break;
    case 'usuń':
      delet(interaction);
      break;
    case 'pokaż':
      show(interaction);
      break;
    default:
      return await interaction.editReply('Niepoprawna komenda');
  }
};

module.exports = {
  name: 'rekomendacje',
  description: 'Dodaj/odejmij rekomendacje.',
  options: [
    {
      name: 'dodaj',
      description: 'Dodaj nowa rekomendacje.',
      type: 1,
      options: [
        {
          name: 'gracz',
          description: 'Kogo rekomendujesz.',
          type: 'USER',
          required: true,
        },
        {
          name: 'powod',
          description: 'Dlaczego dostaje rekomendacje.',
          type: 'STRING',
          required: true
        },
        {
          name: 'ujemna',
          description: 'Czy ma to być ujemna rekomendacja?',
          type: 'BOOLEAN',
        }
      ]
    },
    {
      name: 'usuń',
      description: 'Usuń swoją wcześniej nadaną rekomendacje.',
      type: 1,
      options: [
        {
          name: 'gracz',
          description: 'Komu usuwasz rekomendacje',
          type: 'USER',
          required: true,
        },
        {
          name: 'ujemna',
          description: 'Czy ma chodzi o ujemną rekomendacje?',
          type: 'BOOLEAN',
        }
      ]
    },
  ],
  run
};
