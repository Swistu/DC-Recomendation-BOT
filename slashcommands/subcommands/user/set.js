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

  await updateUser(member.user.id, {
    $set: {
      currentNumber: 0,
      corps: newRankData.payLoad.corps,
      number: newRankData.payLoad.number,
      promotion: false,
      rank: newRankData.payLoad.name,
      recommendations: [],
    }
  }).then(async () => {
    await interaction.editReply();
    repair(client, interaction, 'Poprawnie zmieniono w bazie stopień.\nBot sam naprawił:\n\n');
  })
    .catch(async (e) => {
      console.error(e)
      await interaction.editReply('Nie udało sie ustawić stopnia graczowi');
    });
};

module.exports = {
  set
};