const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags, EmbedBuilder } = require('discord.js');
const { LOG_CHANNEL, EMBED_COLOR, MODERATION_ROLE_ID } = require('../../../../config/settings.json');
const { translate } = require('../../translations.js');
const { Log } = require('../../../../database/models.js');

module.exports = {
    cooldown: 60,
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription(translate('kickDescription'))
        .addUserOption(option =>
            option.setName(translate('memberOption'))
                .setDescription(translate('kickMemberDescription'))
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName(translate('reasonOption'))
                .setDescription(translate('kickReasonDescription'))
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames),

    async execute(interaction) {
        if (!interaction.member.roles.cache.has(MODERATION_ROLE_ID)) {
            return await interaction.reply({ content: translate('missingRole'), flags: [MessageFlags.Ephemeral] });
        }

        const member = interaction.options.getMember(translate('memberOption'));
        const reason = interaction.options.getString(translate('reasonOption')) || translate('noReason');

        try {
            await member.kick(reason);
            await Log.create({
                user_id: member.user.id,
                user_name: member.user.username,
                moderator_id: interaction.user.id,
                moderator_username: interaction.user.username,
                action: `${member.user.username} ${translate('kickLog')} ${interaction.user.username} | ${translate('embedReason')} : ${reason}`
            });
            await interaction.reply({ content: `${member} ${translate('kickSuccess')}`, flags: [MessageFlags.Ephemeral] });
            const logChannel = interaction.guild.channels.cache.get(LOG_CHANNEL);
            if (logChannel) {
                const embed = new EmbedBuilder()
                    .setTitle(translate('kickEmbedTitle'))
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
            await interaction.reply({ content: `${translate('kickError')} ${member}.`, flags: [MessageFlags.Ephemeral] });
        }
    },
};