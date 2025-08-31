const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags, EmbedBuilder } = require('discord.js');
const { LOG_CHANNEL, EMBED_COLOR, STAFF_ROLE_ID } = require('../../../../config/settings.json');
const { translate } = require('../../translations.js');
const { Log } = require('../../../../database/models.js');

module.exports = {
    cooldown: 30,
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription(translate('timeoutDescription'))
        .addUserOption(option =>
            option.setName(translate('memberOption'))
                .setDescription(translate('timeoutMemberDescription'))
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName(translate('reasonOption'))
                .setDescription(translate('timeoutReasonDescription'))
                .setRequired(false)
        )
        .addIntegerOption(option =>
            option.setName(translate('secondsLiteral'))
                .setDescription(translate('timeoutSecondsDescription'))
                .setRequired(false)
        )
        .addIntegerOption(option =>
            option.setName(translate('minutesLiteral'))
                .setDescription(translate('timeoutMinutesDescription'))
                .setRequired(false)
        )
        .addIntegerOption(option =>
            option.setName(translate('hoursLiteral'))
                .setDescription(translate('timeoutHoursDescription'))
                .setRequired(false)
        )
        .addIntegerOption(option =>
            option.setName(translate('daysLiteral'))
                .setDescription(translate('timeoutDaysDescription'))
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames),

    async execute(interaction) {
        if (!interaction.member.roles.cache.has(STAFF_ROLE_ID)) {
            return await interaction.reply({ content: translate('missingRole'), flags: [MessageFlags.Ephemeral] });
        }

        const member = interaction.options.getMember(translate('memberOption'));
        const reason = interaction.options.getString(translate('reasonOption')) || translate('noReason');
        const seconds = interaction.options.getInteger(translate('secondsLiteral')) || 0;
        const minutes = interaction.options.getInteger(translate('minutesLiteral')) || 0;
        const hours = interaction.options.getInteger(translate('hoursLiteral')) || 0;
        const days = interaction.options.getInteger(translate('daysLiteral')) || 0;

        const duration = (seconds * 1000) + (minutes * 60 * 1000) + (hours * 60 * 60 * 1000) + (days * 24 * 60 * 60 * 1000);

        try {
            await member.timeout(duration, reason);
            await Log.create({
                user_id: member.user.id,
                user_name: member.user.username,
                moderator_id: interaction.user.id,
                moderator_username: interaction.user.username,
                action: `${member.user.username} ${translate('timeoutLog1')} ${interaction.user.username} ${translate('timeoutLog2')} ${days}${translate('daysAbbreviation')} ${hours}${translate('hoursAbbreviation')} ${minutes}${translate('minutesAbbreviation')} ${seconds}${translate('secondsAbbreviation')} | ${translate('embedReason')} : ${reason}`
            });
            await interaction.reply({ content: `${member} ${translate('timeoutSuccess')} ${days}d ${hours}h ${minutes}m ${seconds}s.`, flags: [MessageFlags.Ephemeral] });
            const logChannel = interaction.guild.channels.cache.get(LOG_CHANNEL);
            if (logChannel) {
                const embed = new EmbedBuilder()
                    .setTitle(translate('timeoutEmbedTitle'))
                    .addFields(
                        { name: translate('embedMember'), value: member.toString(), inline: true },
                        { name: translate('timeoutEmbedDuration'), value: `${days}${translate('daysAbbreviation')} ${hours}${translate('hoursAbbreviation')} ${minutes}${translate('minutesAbbreviation')} ${seconds}${translate('secondsAbbreviation')}`, inline: true },
                        { name: translate('embedReason'), value: reason, inline: true },
                    )
                    .setColor(EMBED_COLOR)
                    .setTimestamp();

                await logChannel.send({ embeds: [embed] });
            }
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: `${translate('timeoutError')} ${member}.`, flags: [MessageFlags.Ephemeral] });
        }
    },
};