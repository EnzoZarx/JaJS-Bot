const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags, EmbedBuilder } = require('discord.js');
const { LOG_CHANNEL, EMBED_COLOR, MODERATION_ROLE_ID } = require('../../../../config/settings.json');
const { translate } = require('../../translations.js');
const { Log } = require('../../../../database/models.js');

module.exports = {
    cooldown: 60,
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription(translate('banDescription'))
        .addUserOption(option =>
            option.setName(translate('memberOption'))
                .setDescription(translate('banMemberDescription'))
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName(translate('reasonOption'))
                .setDescription(translate('banReasonDescription'))
                .setRequired(false)
        )
        .addIntegerOption(option =>
            option.setName(translate('banDeleteDaysOption'))
                .setDescription(translate('banDeleteDaysDescription'))
                .setRequired(false)
        )
        .addIntegerOption(option =>
            option.setName(translate('banDeleteMinutesOption'))
                .setDescription(translate('banDeleteMinutesDescription'))
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames),

    async execute(interaction) {
        if (!interaction.member.roles.cache.has(MODERATION_ROLE_ID)) {
            return await interaction.reply({ content: translate('missingRole'), flags: [MessageFlags.Ephemeral] });
        }

        const member = interaction.options.getMember(translate('memberOption'));
        const reason = interaction.options.getString(translate('reasonOption')) || translate('noReason');
        const deleteDays = interaction.options.getInteger(translate('banDeleteDaysOption'));
        const deleteMin = interaction.options.getInteger(translate('banDeleteMinutesOption'));

        if (deleteDays !== null && deleteMin !== null) {
            await interaction.reply({ content: translate('banDeleteError'), flags: [MessageFlags.Ephemeral] });
            return;
        }

        const deleteTime = (deleteDays ? deleteDays * 24 * 60 * 60 : 0) + (deleteMin ? deleteMin * 60 : 0);

        try {
            await member.ban({ deleteMessageSeconds: deleteTime, reason: reason });
            await Log.create({
                user_id: member.user.id,
                user_name: member.user.username,
                moderator_id: interaction.user.id,
                moderator_username: interaction.user.username,
                action: `${member.user.username} ${translate('banLog1')} ${interaction.user.username} | ${translate('banLog2')} ${deleteTime}${translate('secondsAbbreviation')} | ${translate('embedReason')} : ${reason}`
            });
            await interaction.reply({ content: `${member} ${translate('banSuccess')}`, flags: [MessageFlags.Ephemeral] });
            const logChannel = interaction.guild.channels.cache.get(LOG_CHANNEL);
            if (logChannel) {
                const embed = new EmbedBuilder()
                    .setTitle(translate('banEmbedTitle'))
                    .addFields(
                        { name: translate('embedMember'), value: member.toString(), inline: true },
                        { name: translate('embedReason'), value: reason, inline: true },
                    )
                    .setColor(EMBED_COLOR)
                    .setTimestamp();

                await logChannel.send({ embeds: [embed] });
            }
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: `${translate('banError')} ${member}.`, flags: [MessageFlags.Ephemeral] });
        }
    },
};