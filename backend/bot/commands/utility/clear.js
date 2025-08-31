const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const { STAFF_ROLE_ID } = require('../../../../config/settings.json');
const { translate } = require('../../translations');
const { Log } = require('../../../../database/models.js');

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription(translate('clearDescription'))
        .addUserOption(option =>
            option.setName(translate('memberOption'))
                .setDescription(translate('clearMemberDescription'))
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName(translate('hoursLiteral'))
                .setDescription(translate('clearHoursDescription'))
                .setRequired(false))
        .addIntegerOption(option =>
            option.setName(translate('minutesLiteral'))
                .setDescription(translate('clearMinutesDescription'))
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames),

    async execute(interaction) {
        if (!interaction.member.roles.cache.has(STAFF_ROLE_ID)) {
            return await interaction.reply({ content: translate('missingRole'), flags: [MessageFlags.Ephemeral] });
        }

        const member = interaction.options.getUser(translate('memberOption'));
        const hours = interaction.options.getInteger(translate('hoursLiteral'));
        const minutes = interaction.options.getInteger(translate('minutesLiteral'));

        if ((hours && minutes) || (!hours && !minutes)) {
            return interaction.reply({ content: translate('clearDurationError'), flags: [MessageFlags.Ephemeral] });
        }

        const timeLimit = Date.now() - ((hours ? hours * 60 : minutes) * 60 * 1000);
        const messages = await interaction.channel.messages.fetch({ limit: 100 });
        const userMessages = messages.filter(msg => msg.author.id === member.id && msg.createdTimestamp >= timeLimit);

        await interaction.channel.bulkDelete(userMessages, true).catch(error => {
            console.error(error);
            return interaction.reply({ content: translate('clearError'), flags: [MessageFlags.Ephemeral] });
        });

        await Log.create({
            user_id: member.id,
            user_name: member.username,
            moderator_id: interaction.user.id,
            moderator_username: interaction.user.username,
            action: `${userMessages.size} ${translate('clearLog')} ${member.username}`
        });

        await interaction.reply({ content: `${translate('clearSuccessPart1')} __**${userMessages.size}** ${translate('clearSuccessPart2')}__ ${translate('clearSuccessPart3')} ${member} ${translate('clearSuccessPart4')} __**${hours ? hours + `${translate('hoursAbbreviation')}` : minutes + `${translate('minutesAbbreviation')}`}**__.`, flags: [MessageFlags.Ephemeral] });
    },
};