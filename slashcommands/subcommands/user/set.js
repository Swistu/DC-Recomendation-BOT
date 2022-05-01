const { getRankData } = require("../../../database/getRankData");
const { updateUser } = require("../../../database/updateUser");
const { repair } = require("./repair");

const set = async (client, interaction) => {
  const newRankName = interaction.options.getString('rank');
  const member = interaction.options.getMember('gracz');


  if (!newRankName)
    return await interaction.editReply('Nie udało sie pobrać nazwy nowego stopnia');

  const newRankData = await getRankData({ name: newRankName });

  if (!newRankData.valid)
    return await interaction.editReply(newRankData.errorMessage);

  const result = await updateUser(member.user.id, {
    $set: {
      currentNumber: 0,
      corps: newRankData.payLoad.corps,
      number: newRankData.payLoad.number,
      promotion: false,
      rank: newRankData.payLoad.name,
      recommendations: [],
    }
  });

  if (!result.valid) {
    await interaction.editReply(result.errorMessage);
  }
  
  repair(client, interaction, `Poprawnie zaktualizowano stopień <@${member.user.id}> w bazie.\nBot sam naprawił:\n\n`);
};

module.exports = {
  set
};