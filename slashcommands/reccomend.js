const KORPUS_SZEREGOWYCH = "Korpus Szeregowych";
const KORPUS_PODOFICEROW = "Korpus Podoficerów";
const KORPUS_OFICEROW = "Korpus Oficerów";

const checkCorpsRole = (member) => {
  if (member.roles.cache.some(role => role.name === KORPUS_OFICEROW))
    return KORPUS_OFICEROW;
  else if (member.roles.cache.some(role => role.name === KORPUS_PODOFICEROW))
    return KORPUS_PODOFICEROW
  else if (member.roles.cache.some(role => role.name === KORPUS_SZEREGOWYCH))
    return KORPUS_SZEREGOWYCH
}

const checkRole = (member, targetRoles) => {
  for (let i = 0; i < targetRoles.length; i++) {
    if (member.roles.cache.some(role => role.name === targetRoles[i]))
      return true;
  }
  return false;
}

const assaignReccomendation = (interaction, korpusRekomendujacego, korpusRekomendowanego, memberRecommended, memberRecommender) => {

  return interaction.reply(`Rekomendujący: ${interaction.user.username}(${korpusRekomendujacego})\n1x ${memberRecommended.user.username}(${korpusRekomendowanego})  - ${reason}`);
}

const run = async (client, interaction) => {
  let memberRecommended = interaction.options.getMember("gracz");
  let memberRecommender = interaction.member;
  let reason = interaction.options.getString("powod");
  let korpusRekomendowanego, korpusRekomendujacego;

  if (!memberRecommended) return interaction.reply({ content: "Niepoprawny użytkownik", ephemeral: true })

  korpusRekomendowanego = checkCorpsRole(memberRecommended);
  korpusRekomendujacego = checkCorpsRole(memberRecommender);

  if(korpusRekomendowanego !== KORPUS_OFICEROW && korpusRekomendowanego !== KORPUS_PODOFICEROW && korpusRekomendowanego !== KORPUS_SZEREGOWYCH)
    return interaction.reply({ content: "Rekomendowany nie nalezy do żadnego korpusu", ephemeral: true });

  if (korpusRekomendujacego === KORPUS_SZEREGOWYCH) return interaction.reply({ content: "Twój korpus nie może dawać rekomendacji", ephemeral: true });

  if (korpusRekomendujacego === korpusRekomendowanego) {
    if (korpusRekomendujacego === KORPUS_OFICEROW && checkRole(memberRecommender, ["Pułkownik", "Generał"]))
      return assaignReccomendation(interaction, korpusRekomendujacego, korpusRekomendowanego, memberRecommended, memberRecommender)
    return interaction.reply({ content: "Nie możesz rekomendować tej osoby", ephemeral: true })
  }

  if (korpusRekomendujacego === KORPUS_PODOFICEROW && korpusRekomendowanego === KORPUS_SZEREGOWYCH) {
    if (checkRole(memberRecommended, ["St. Szeregowy"]))
      return interaction.reply({ content: "Nie możesz rekomendować tej osoby", ephemeral: true })
    else
      return interaction.reply(`Rekomendujący: ${interaction.user.username}(${korpusRekomendujacego})\n1x ${memberRecommended.user.username}(${korpusRekomendowanego})  - ${reason}`);
  }


  if (korpusRekomendujacego === KORPUS_OFICEROW) {
    return interaction.reply(`Rekomendujący: ${interaction.user.username}(${korpusRekomendujacego})\n1x ${memberRecommended.user.username}(${korpusRekomendowanego})  - ${reason}`);
  }


  return interaction.reply({ content: "Nie możesz rekomendować tej osoby", ephemeral: true })

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