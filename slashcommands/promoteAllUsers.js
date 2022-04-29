const { getAllPromotionsList } = require("../database/getAllPromotionsList");
const { promoteUser } = require("../utility/promoteUser");

const run = async (client, interaction) => {
  await interaction.reply("Trwa awansowanie graczy...");

  const userList = await getAllPromotionsList();

  if (!userList.valid) {
    await interaction.editReply(userList.errorMessage);
    return;
  }

  if (userList.payLoad.validUserList.length === 0) {
    await interaction.editReply("Nie ma graczy, których można awansować");
    return;
  }

  const guildMembers = await client.guilds.cache.get("935268119365156884").members
  const responseList = [];

  for(const element of userList.payLoad.validUserList){
    const guildMember = await guildMembers.fetch(element.userID);
    const data = await promoteUser(guildMember);

    responseList.push(data);
  }

  let promotionApproved = "";
  let promotionUnapproved = "";

  responseList.forEach((element) => {
    if (element.valid) {
      promotionApproved += `${element.payLoad.oldRank} <@${element.payLoad.userID}> awansuje na ${element.payLoad.newRank}\n`;
    } else {
      promotionUnapproved += `<@${element.payLoad.userID}> - ${element.errorMessage}\n`;
    }
  })

  await interaction.editReply(promotionApproved + "\n" + promotionUnapproved);
}

module.exports = {
  name: "przyznajawanse",
  description: "Awansuje wszystkich możliwych graczy.",
  run
}