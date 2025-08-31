const path = require('node:path');
const fetch = require('node-fetch');
const { Events, EmbedBuilder } = require('discord.js');
const Jimp = require('jimp');
const sharp = require('sharp');

const { CLIENT_ID } = require('../../../config/config.json');
const { WELCOME_CHANNEL, EMBED_COLOR } = require('../../../config/settings.json');
const { translate } = require('../translations');
const backgroundPath = path.join(__dirname, 'images/background.png');
const fontPath = path.join(__dirname, 'images/fonts/gluketiuda-semibold.fnt');

async function processWebpToJimp(url) {
    if (url.includes('.webp')) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Error during image fetching: ${response.statusText}`);

            const webpBuffer = await response.arrayBuffer();
            const pngBuffer = await sharp(Buffer.from(webpBuffer)).png().toBuffer();

            return pngBuffer;
        } catch (error) {
            console.error(`Error processing WebP image: ${error.message}`);
        }
    } else {
        return url;
    }
}

/**
 * Generates a welcome banner image for a new guild member.
 *
 * The banner includes the member's avatar, the bot's avatar, and a randomly selected welcome message.
 * Avatars are resized and cropped into circles before being composited onto the background image.
 *
 * @async
 * @param {GuildMember} member - The guild member who joined.
 * @param {Client} client - The Discord client instance.
 * @returns {Promise<Jimp>} The generated banner image as a Jimp object.
 */
async function generateBanner(member, client) {
    const image = await Jimp.read(backgroundPath);
    const font = await Jimp.loadFont(fontPath);
    const memberAvatar = await Jimp.read(await processWebpToJimp(member.user.displayAvatarURL({ size: 1024 })));

    memberAvatar.resize(256, 256).circle();
    image.composite(memberAvatar, 384, 23);

    const welcomeText = translate('welcome_sentences')[Math.floor(Math.random() * translate('welcome_sentences').length)];
    image.print(font, 0, 330, {
        text: welcomeText,
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_TOP,
    }, image.bitmap.width, image.bitmap.height);

    image.quality(100);
    image.autocrop();

    return image;
}

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        const client = member.guild.members.cache.get(CLIENT_ID)
        const channel = member.guild.channels.cache.get(WELCOME_CHANNEL);
        const banner = await generateBanner(member, client);
        const buffer = await banner.getBufferAsync(Jimp.MIME_PNG);
        const embed = new EmbedBuilder()
            .setDescription(`### <@${member.user.id}>\n## :confetti_ball: ${translate('welcome_embed_description')}`)
            .setFooter({ text: client.user.username + " | " + member.guild.name, iconURL: client.user.displayAvatarURL() })
            .setColor(EMBED_COLOR)
            .setTimestamp();

        channel.send({
            embeds: [embed],
            files: [{ attachment: buffer, name: 'welcome.png' }]
        });
    },
};