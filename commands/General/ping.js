const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('ping will reply with beer pong.'),
    async execute(interaction){
        await interaction.reply('Beer Pong!')
    },
};
