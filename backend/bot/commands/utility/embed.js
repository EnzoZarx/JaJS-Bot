const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, SlashCommandBuilder, MessageFlags, EmbedBuilder } = require('discord.js');
const { translate } = require('../../translations.js');
const { EMBED_COLOR, STAFF_ROLE_ID } = require('../../../../config/settings.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embed')
        .setDescription(translate('embedDescription')),

    async execute(interaction) {
        if (!interaction.member.roles.cache.has(STAFF_ROLE_ID)) {
            return await interaction.reply({ content: translate('missingRole'), flags: [MessageFlags.Ephemeral] });
        }

        const modal = new ModalBuilder()
            .setCustomId('embedModal')
            .setTitle(translate('embedTitle'));

        const titleInput = new TextInputBuilder()
            .setCustomId('titleInput')
            .setLabel(translate('embedTitleLabel'))
            .setStyle(TextInputStyle.Short);

        const descriptionInput = new TextInputBuilder()
            .setCustomId('descriptionInput')
            .setLabel(translate('embedDescriptionLabel'))
            .setStyle(TextInputStyle.Paragraph);

        const firstActionRow = new ActionRowBuilder().addComponents(titleInput);
        const secondActionRow = new ActionRowBuilder().addComponents(descriptionInput);

        modal.addComponents(firstActionRow, secondActionRow);

        await interaction.showModal(modal);

        interaction.awaitModalSubmit({ time: 120000 }).then((modalInteraction) => {
            const title = modalInteraction.fields.getTextInputValue('titleInput');
            const description = modalInteraction.fields.getTextInputValue('descriptionInput');

            const embed = new EmbedBuilder()
                .setAuthor({
                    name: interaction.user.username,
                    iconURL: interaction.user.displayAvatarURL()
                })
                .setTitle(title)
                .setDescription(description)
                .setColor(EMBED_COLOR)
                .setTimestamp();

            modalInteraction.reply({ embeds: [embed] });
        }).catch((err) => {
            console.log(err);
            interaction.followUp({ content: translate('embedTimedOut'), flags: [MessageFlags.Ephemeral] });
        });
    }
};