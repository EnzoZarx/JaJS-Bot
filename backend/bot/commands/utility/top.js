const { SlashCommandBuilder, MessageFlags, EmbedBuilder } = require('discord.js');
const { translate } = require('../../translations.js');
const { XP } = require('../../../../database/models.js');
const { EMBED_COLOR } = require('../../../../config/settings.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('top')
        .setDescription(translate('topDescription')),

    async execute(interaction) {
        const topUsers = await XP.findAll({
            order: [['level', 'DESC']],
            limit: 10
        });

        const embed = new EmbedBuilder()
            .setTitle(`:medal: __${translate('topEmbedTitle')}__`)
            .setColor(EMBED_COLOR)
            .setTimestamp();


        topUsers.forEach((element, index) => {
            embed.addFields(
                { name: '', value: `> :bust_in_silhouette: **${translate('topEmbedMember')}** <@${element.user_id}> | :trophy: **${translate('topEmbedRank')}** ${index + 1} | :sparkles: **${translate('topEmbedLevel')}** ${element.level}`, inline: false },
            );
        });

        await interaction.reply({ embeds: [embed], flags: [MessageFlags.Ephemeral] });
    }
};
