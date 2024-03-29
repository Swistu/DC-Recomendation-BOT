const { repair } = require("./subcommands/user/repair");
const { show } = require("./subcommands/user/show");
const { add } = require("./subcommands/user/add");
const { set } = require("./subcommands/user/set");
const { active } = require("./subcommands/user/active");
const constants = require("../utility/constants");

const getAllRanks = (ranks) => {
  const ranksTab = Object.values(ranks);

  return ranksTab.map(element => ({ name: element, value: element }))
}
const allRanks = getAllRanks(constants.RANKS);

const run = async (client, interaction) => {
  await interaction.reply('Uruchamiam komende...');

  switch (await interaction.options.getSubcommand()) {
    case 'pokaż':
      show(interaction);
      break;
    case 'dodaj':
      add(client, interaction);
      break;
    case 'ustaw':
      set(client, interaction);
      break;
    case 'napraw':
      repair(client, interaction);
      break;
    case 'konto':
      active(interaction);
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
      name: 'pokaż',
      description: 'Pokazuje wszystkie dane na temat gracza..',
      type: 1,
      options: [
        {
          name: 'gracz',
          description: 'Nick gracza, którego chcesz sprawdzić.',
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
    },
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
      name: 'konto',
      description: 'Ustawianie aktywności konta gracza w bazie danych.',
      type: 1,
      options: [
        {
          name: 'gracz',
          description: 'Nick gracza do zmiany aktywności.',
          type: 'USER',
          required: true,
        },
        {
          name: 'aktywne',
          description: 'Aktywny (true) dla obecnych członków klanu. Nieaktywny (false) jak ktoś opuści klan.',
          type: 'BOOLEAN',
          required: true,
        }
      ]  
    }
  ],
  run
};
