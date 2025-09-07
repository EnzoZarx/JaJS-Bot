const { Events, EmbedBuilder } = require('discord.js');

const { INACTIVE_XP_CHANNELS, RANK_UPDATE_CHANNEL, RANK_UPDATE_ROLES, EMBED_COLOR, NON_MESSAGE_CHANNELS } = require('../../../config/settings.json');
const { XP } = require('../../../database/models.js');
const { translate } = require('../translations.js')

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (NON_MESSAGE_CHANNELS.includes(message.channel.id)) {
            message.delete();
            return;
        }
        if (message.author.bot || INACTIVE_XP_CHANNELS.includes(message.channel.id) || message.content.length < 2) {
            return;
        } else {
            const user = await XP.findOne({ where: { user_id: message.author.id } });
            if (user) {
                const updated_xp = user.total_xp + 10;
                if (updated_xp >= user.next_xp) {
                    XP.update({
                        level: user.level + 1,
                        next_xp: 100 * (Math.pow(1.1, user.level + 2) - 1) / (1.1 - 1),
                        user_name: message.author.username,
                        total_messages: user.total_messages + 1,
                        total_xp: user.total_xp + 10
                    }, {
                        where: { user_id: message.author.id }
                    });

                    const levelUpChannel = message.client.channels.cache.get(RANK_UPDATE_CHANNEL);
                    const member = message.member;

                    if (levelUpChannel) {
                        const embedLevelUp = new EmbedBuilder()
                            .setTitle(translate('rankUpTitle1'))
                            .setDescription(`${member.toString()} ${translate('rankUpDescription1')} ${user.level + 1}.`)
                            .setColor(EMBED_COLOR)
                            .setTimestamp();
                        await levelUpChannel.send({ embeds: [embedLevelUp] });
                        const embedRankUp = new EmbedBuilder()
                            .setTitle(translate('rankUpTitle2'))
                            .setDescription(`${member.toString()} ${translate('rankUpDescription2')}`)
                            .setColor(EMBED_COLOR)
                            .setTimestamp();

                        switch (user.level + 1) {
                            case 15:
                                member.roles.add(RANK_UPDATE_ROLES[0]);
                                await levelUpChannel.send({ embeds: [embedRankUp] });
                                break;
                            case 30:
                                member.roles.remove(RANK_UPDATE_ROLES[0]);
                                member.roles.add(RANK_UPDATE_ROLES[1]);
                                await levelUpChannel.send({ embeds: [embedRankUp] });
                                break;
                            case 40:
                                member.roles.remove(RANK_UPDATE_ROLES[1]);
                                member.roles.add(RANK_UPDATE_ROLES[2]);
                                await levelUpChannel.send({ embeds: [embedRankUp] });
                                break;
                            case 50:
                                member.roles.remove(RANK_UPDATE_ROLES[2]);
                                member.roles.add(RANK_UPDATE_ROLES[3]);
                                await levelUpChannel.send({ embeds: [embedRankUp] });
                                break;
                            default:
                                break;
                        }
                    }
                } else {
                    XP.update({
                        user_name: message.author.username,
                        total_messages: user.total_messages + 1,
                        total_xp: user.total_xp + 10
                    }, {
                        where: { user_id: message.author.id }
                    });
                }
            } else {
                XP.create({
                    user_id: message.author.id,
                    user_name: message.author.username
                });
            }
        }
    },
};