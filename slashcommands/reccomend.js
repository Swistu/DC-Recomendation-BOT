const { recommendUser } = require('../database/recommendUser.js');
const constants = require('../utility/constants');

const checkCorpsRole = (member) => {
  if (member.roles.cache.some(role => role.name === constants.CORPS.KORPUS_OFICEROW))
    return constants.CORPS.KORPUS_OFICEROW;
  if (member.roles.cache.some(role => role.name === constants.CORPS.KORPUS_PODOFICEROW))
    return constants.CORPS.KORPUS_PODOFICEROW
  if (member.roles.cache.some(role => role.name === constants.CORPS.KORPUS_STRZELCOW))
    return constants.CORPS.KORPUS_STRZELCOW
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
    "Młodszy Sierżant",
    "Chorąży",
    "Starszy Chorąży",
    "Starszy Chorąży Sztabowy",
    "Podporucznik",
    "Porucznik",
    "Kapitan",
    "Major",
    "Podpułkownik",
    "Pułkownik",
    "Generał"
  ];
  for (let i = 0; i < ranks.length; i++) {
    if (member.roles.cache.some(role => role.name === ranks[i]))
      return ranks[i];
  }

  return false;
}

const assaignReccomendation = async (interaction, korpusRekomendujacego, korpusRekomendowanego, memberRecommended, memberRecommender, reason) => {
  const memberRank = checkMemberRole(memberRecommended);

  if (memberRank === false) {
    interaction.reply("Rekomendowany nie posiada żadnego stopnia.");
    return;
  }

  try {
    await interaction.reply({ content: "Sprawdzam rekomendacje ...", });
    const result = await recommendUser(memberRecommender, memberRecommended, memberRank, korpusRekomendowanego, reason)

    if (!result.valid) {
      await interaction.editReply(result.errorMessage);
      return;
    }

    await interaction.editReply(
      `Rekomendujący: <@${interaction.user.id}> <@${korpusRekomendujacego}>\n
      <@${memberRecommended.user.id}> <@${korpusRekomendowanego}>  - ${reason}`,
    );


  } catch (e) {
    interaction.reply('Wystąpił bład :(', e);
  }
}

const run = async (client, interaction) => {
  let memberRecommended = interaction.options.getMember("gracz");
  let memberRecommender = interaction.member;
  let reason = interaction.options.getString("powod");
  let korpusRekomendowanego, korpusRekomendujacego;

  if (!memberRecommended)
    return interaction.reply("Niepoprawny użytkownik")

  korpusRekomendowanego = checkCorpsRole(memberRecommended);
  korpusRekomendujacego = checkCorpsRole(memberRecommender);

  if (korpusRekomendowanego !== constants.CORPS.KORPUS_OFICEROW && korpusRekomendowanego !== constants.CORPS.KORPUS_PODOFICEROW && korpusRekomendowanego !== constants.CORPS.KORPUS_STRZELCOW)
    return interaction.reply({ content: "Rekomendowany nie nalezy do żadnego korpusu", });

  if (korpusRekomendujacego === constants.CORPS.KORPUS_STRZELCOW)
    return interaction.reply({ content: "Twój korpus nie może dawać rekomendacji", });

  if (korpusRekomendujacego === korpusRekomendowanego) {
    if (korpusRekomendujacego === constants.CORPS.KORPUS_OFICEROW && checkRole(memberRecommender, ["Podpułkownik", "Pułkownik", "Generał"]))
      return assaignReccomendation(interaction, korpusRekomendujacego, korpusRekomendowanego, memberRecommended, memberRecommender, reason)
    return interaction.reply({ content: "Nie możesz rekomendować osoby z tego samego korpusu.", })
  }

  if (korpusRekomendujacego === constants.CORPS.KORPUS_PODOFICEROW && korpusRekomendowanego === constants.CORPS.KORPUS_STRZELCOW) {
    if (checkRole(memberRecommended, ["Starszy Szeregowy"]))
      return interaction.reply({ content: "Nie możesz rekomendować tej osoby", })
    else
      return assaignReccomendation(interaction, korpusRekomendujacego, korpusRekomendowanego, memberRecommended, memberRecommender, reason)
  }

  if (korpusRekomendujacego === constants.CORPS.KORPUS_OFICEROW) {
    return assaignReccomendation(interaction, korpusRekomendujacego, korpusRekomendowanego, memberRecommended, memberRecommender, reason)
  }

  return interaction.reply({ content: "Nie możesz rekomendować tej osoby", })
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