const run = async (client, interaction) => {
 let member = interaction.options.getMember("gracz");
let korpusRekomendowanego, korpusRekomendujacego;

  
  if(interaction.member.roles.cache.some(r => r.name === "Korpus Oficerów"))
    korpusRekomendujacego = "Korpus Oficerów";
  if(interaction.member.roles.cache.some(r => r.name === "Korpus Podoficerów"))
    korpusRekomendujacego = "Korpus Podoficerów";
  if(interaction.member.roles.cache.some(r => r.name === "Korpus Szeregowych"))
    korpusRekomendujacego = "Korpus Szeregowych";

  if(member.roles.cache.some(r => r.name === "Korpus Oficerów"))
    korpusRekomendowanego = "Korpus Oficerów";
  if(member.roles.cache.some(r => r.name === "Korpus Podoficerów"))
    korpusRekomendowanego = "Korpus Podoficerów";
  if(member.roles.cache.some(r => r.name === "Korpus Szeregowych"))
    korpusRekomendowanego = "Korpus Szeregowych";

    
    let reason = interaction.options.getString("powod");

    if(!member) return interaction.reply({content: "Niepoprawny użytkownik", ephemeral: true})
    console.log(korpusRekomendujacego + " - " + korpusRekomendowanego);

    if(korpusRekomendujacego === "Korpus Podoficerów" && korpusRekomendowanego === "Korpus Szeregowych")
      if(member.roles.cache.some(r => r.name === "St. Szeregowy")) return interaction.reply({content: "Nie możesz rekomendować na swój stopień", ephemeral: true})
    if(korpusRekomendujacego === korpusRekomendowanego ) return interaction.reply({content: "Nie możesz rekomendować tej osoby", ephemeral: true})
  

 interaction.reply(`Rekomendujący: ${interaction.user.username}(${korpusRekomendujacego})\n1x ${member.user.username}(${korpusRekomendowanego})  - ${reason}`);

}

module.exports = {
  name: "rekomenduj",
  description: "Zarekomenduj gracza",
  perm: "MODERATE_MEMBERS",
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