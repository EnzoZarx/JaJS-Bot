const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const { HOLIDAY_ROLE_ID, STAFF_ROLE_ID } = require('../../../../config/settings.json');
const { translate } = require('../../translations.js');
const { Log } = require('../../../../database/models.js');

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('holiday')
        .setDescription(translate('holidayDescription'))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames),

    async execute(interaction) {
        if (!interaction.member.roles.cache.has(STAFF_ROLE_ID)) {
            return await interaction.reply({ content: translate('missingRole'), flags: [MessageFlags.Ephemeral] });
        }

        const member = interaction.options.getMember('member') || interaction.member;
        if (member.roles.cache.has(HOLIDAY_ROLE_ID)) {
            member.roles.remove(HOLIDAY_ROLE_ID);
            await Log.create({
                user_id: member.id,
                user_name: member.user.username,
                action: member.user.username + ' ' + translate('holidayLog2')
            });
            return await interaction.reply({ content: translate('holidaySuccess2'), flags: [MessageFlags.Ephemeral] });
        } else {
            member.roles.add(HOLIDAY_ROLE_ID);
            await Log.create({
                user_id: member.id,
                user_name: member.user.username,
                action: member.user.username + ' ' + translate('holidayLog1')
            });
            await interaction.reply({ content: translate('holidaySuccess1'), flags: [MessageFlags.Ephemeral] });
        }
    },
};