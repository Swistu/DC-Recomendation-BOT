const { getUserData } = require("../../../database/getUserData");
const { updateUser } = require("../../../database/updateUser");

const active = async (interaction) => {
    const user = await interaction.options.getMember('gracz');
    const active = await interaction.options.getBoolean('aktywne');
    if (!user) {
        return await interaction.editReply('Podano niewłaściwego gracza.');
    }

    const userData = await getUserData(user.user.id);

    if (!userData.valid) {
        return await interaction.editReply(userData.errorMessage);
    }

    const result = await updateUser(user.user.id, { $set: { "accountActive": active } });

    if (!result.valid) {
      return await interaction.editReply(result.errorMessage);
    }
    return await interaction.editReply("Konto <@" + user.user.id + "> zostało ustawione na " + (active ? "aktywne." : "nieaktywne."));
};

module.exports = { active };