const database = require('../database/recommendPlayer.js');
const { getErrorMessage } = require('../helper/errorMessage');

const KORPUS_STRZELCOW = "Korpus Strzelców";
const KORPUS_PODOFICEROW = "Korpus Podoficerów";
const KORPUS_OFICEROW = "Korpus Oficerów";


const checkCorpsRole = (member) => {
  if (member.roles.cache.some(role => role.name === KORPUS_OFICEROW))
    return KORPUS_OFICEROW;
  if (member.roles.cache.some(role => role.name === KORPUS_PODOFICEROW))
    return KORPUS_PODOFICEROW
  if (member.roles.cache.some(role => role.name === KORPUS_STRZELCOW))
    return KORPUS_STRZELCOW
}

const checkRole = (member, targetRoles) => {
  for (let i = 0; i < targetRoles.length; i++) {
    if (member.roles.cache.some(role => role.name === targetRoles[i]))
      return true;
  }
  return false;
}

const checkMemberRole = (member) => {
  const ranks = [
    "Szeregowy",
    "Starszy Szeregowy",
    "Kapral",
    "Starszy Kapral",
    "Plutonowy",
    "Sierżant",
    "Starszy Sierżant",
    "Młodszy Sierżant" ,
    "Chorąży",
    "Starszy Chorąży" ,
    "Starszy Chorąży Sztabowy",
    "Podporucznik",
    "Porucznik",
    "Kapitan",
    "Major",
    "Podpułkownik",
    "Pułkownik"
  ];    

  for (let i = 0; i < ranks.length; i++) {
    if (member.roles.cache.some(role => role.name === ranks[i]))
      return ranks[i];
  }
  return false;
}

const assaignReccomendation = async (interaction, korpusRekomendujacego, korpusRekomendowanego, memberRecommended, memberRecommender, reason) => {
  const memberRank = checkMemberRole(memberRecommended);

  if(memberRank === false){
    interaction.reply({ content: "Rekomendowany nie posiada żadnej rangi." });
    return;
  }
  try {
    await interaction.reply({ content: "Sprawdzam rekomendacje ...",  });
    const wynik = await database.recommendPlayer(memberRecommender, memberRecommended, memberRank, korpusRekomendowanego, reason)

    if (wynik)
      await interaction.editReply({
        content: `Rekomendujący: ${interaction.user.username}(${korpusRekomendujacego})\n
      1x ${memberRecommended.user.username}(${korpusRekomendowanego})  - ${reason}`,
        
      });
    else
      await interaction.editReply({ content: getErrorMessage() });



  } catch (e) {
    interaction.reply('Wystąpił bład :(', e);
  }
}

const run = async (client, interaction) => {
  let memberRecommended = interaction.options.getMember("gracz");
  let memberRecommender = interaction.member;
  let reason = interaction.options.getString("powod");
  let korpusRekomendowanego, korpusRekomendujacego;

  if (!memberRecommended) return interaction.reply({ content: "Niepoprawny użytkownik",  })

  korpusRekomendowanego = checkCorpsRole(memberRecommended);
  korpusRekomendujacego = checkCorpsRole(memberRecommender);

  if (korpusRekomendowanego !== KORPUS_OFICEROW && korpusRekomendowanego !== KORPUS_PODOFICEROW && korpusRekomendowanego !== KORPUS_STRZELCOW)
    return interaction.reply({ content: "Rekomendowany nie nalezy do żadnego korpusu",  });

  if (korpusRekomendujacego === KORPUS_STRZELCOW)
    return interaction.reply({ content: "Twój korpus nie może dawać rekomendacji",  });

  if (korpusRekomendujacego === korpusRekomendowanego) {
    if (korpusRekomendujacego === KORPUS_OFICEROW && checkRole(memberRecommender, ["Pułkownik", "Generał"]))
      return assaignReccomendation(interaction, korpusRekomendujacego, korpusRekomendowanego, memberRecommended, memberRecommender, reason)
    return interaction.reply({ content: "Nie możesz rekomendować osoby z tego samego korpusu.",  })
  }

  if (korpusRekomendujacego === KORPUS_PODOFICEROW && korpusRekomendowanego === KORPUS_STRZELCOW) {
    if (checkRole(memberRecommended, ["Starszy Szeregowy"]))
      return interaction.reply({ content: "Nie możesz rekomendować tej osoby",  })
    else
      return assaignReccomendation(interaction, korpusRekomendujacego, korpusRekomendowanego, memberRecommended, memberRecommender, reason)
  }

  if (korpusRekomendujacego === KORPUS_OFICEROW) {
    return assaignReccomendation(interaction, korpusRekomendujacego, korpusRekomendowanego, memberRecommended, memberRecommender, reason)
  }

  return interaction.reply({ content: "Nie możesz rekomendować tej osoby",  })
}
module.exports = {
  name: "rekomenduj",
  description: "Zarekomenduj gracza",
  options: [
    {
      name: 'gracz',
      description: 'Kogo rekomendujesz',
      type: 'USER',
      required: true,
    },
    {
      name: 'powod',
      description: 'Dlaczego dostaje rekomendacje',
      type: 'STRING',
      required: true
    }
  ], run
}