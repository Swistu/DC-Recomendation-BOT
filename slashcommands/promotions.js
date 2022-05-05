const { give } = require("./subcommands/promotions/give");
const { show } = require("./subcommands/promotions/show");

const run = async (client, interaction) => {
  await interaction.reply('Trwa sprawdzanie awansów...');
  
  switch (await interaction.options.getSubcommand()) {
    case 'pokaż':
      show(interaction);
      break;
    case 'przyznaj':
      give(client, interaction);
      break;
    default:
      return await interaction.editReply('Niepoprawna subkomenda');
  }
};

module.exports = {
  name: 'awanse',
  description: 'Sprawdzanie/przyznawanie awansów.',
  options: [
    {
      name: 'pokaż',
      description: 'Pokazuje wszystke nadchodzące awanse.',
      type: 1,
    },
    {
      name: 'przyznaj',
      description: 'Przyznaje wszystkie możliwe awanse.',
      type: 1,
      options: [
        {
          name: 'gracz',
          description: 'Nick gracza, którego chcesz awansować.',
          type: 'USER',
        },
      ]
    },
  ],
  run,
};
