const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { translate } = require('../../translations.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription(translate('pingDescription')),

    async execute(interaction) {
        await interaction.reply({ content: translate('pingSuccess'), flags: [MessageFlags.Ephemeral] });
    }
};
