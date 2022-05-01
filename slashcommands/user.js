const { repair } = require("./subcommands/user/repair");
const { add } = require("./subcommands/user/add");
const { set } = require("./subcommands/user/set");
const constants = require("../utility/constants");


const getAllRanks = (ranks) => {
  const ranksTab = Object.values(ranks);

  return ranksTab.map(element => ({ name: element, value: element }))
}

const allRanks = getAllRanks(constants.RANKS);

const run = async (client, interaction) => {
  await interaction.reply('Trwa sprawdzanie rekomendacji...');

  switch (await interaction.options.getSubcommand()) {
    case 'napraw':
      repair(client, interaction);
      break;
    case 'dodaj':
      add(interaction);
      break;
    case 'ustaw':
      set(client, interaction);
      break;
    default:
      return await interaction.editReply('Niepoprawna subkomenda');
  }
};

module.exports = {
  name: 'gracz',
  description: 'test',
  options: [
    {
      name: 'napraw',
      description: 'Naprawia rangi/ustawienia/baze danych użytkownika.',
      type: 1,
      options: [
        {
          name: 'gracz',
          description: 'Nick gracza do naprawy',
          type: 'USER',
          required: true,
        },
      ],
    },
    {
      name: 'dodaj',
      description: 'Dodaje nowego użytkownika do bazy.',
      type: 1,
      options: [
        {
          name: 'gracz',
          description: 'Nick użytkownika',
          type: 'USER',
          required: true,
        },
      ]
    },
    {
      name: 'ustaw',
      description: 'Ustawia użytkownikowi konkretny stopień i zeruje rekomendacje.',
      type: 1,
      options: [
        {
          name: 'gracz',
          description: 'Nick użytkownika',
          type: 'USER',
          required: true,
        },
        {
          name: 'rank',
          description: 'Stopień jaki ma otrzymać gracz.',
          type: 'STRING',
          required: true,
          choices: allRanks
        },
      ]
    }
  ],
  run,
};
