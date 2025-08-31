const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { translate } = require('../../translations.js');
const { XP } = require('../../../../database/models.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rank')
        .setDescription(translate('rankDescription')),

    async execute(interaction) {
        const userId = interaction.user.id;
        const userXP = await XP.findOne({ where: { user_id: userId } });

        if (!userXP) {
            await interaction.reply({ content: translate('rankError'), flags: [MessageFlags.Ephemeral] });
            return;
        }

        rankSentence = `${translate('rankSentence')} ${userXP.level}`;
        await interaction.reply({ content: rankSentence, flags: [MessageFlags.Ephemeral] });
    }
};
