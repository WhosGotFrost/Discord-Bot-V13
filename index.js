// Require the necessary discord.js classes
//Discord V13 uses Nodejs 16.6.0 or newer!
const {Client, Intents, Collection} = require('discord.js')
const config = require('./config.json');
const { deploy } = require('./deploy');
const bot = new Client({intents : [Intents.FLAGS.GUILDS]});
const fs = require('fs');

//Command Handler
bot.commands = new Collection();

const commandFolders = fs.readdirSync('./commands');
  for (const folder of commandFolders){
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
      for (const file of commandFiles){
        const command = require(`./commands/${folder}/${file}`);
        bot.commands.set(command.data.name, command);
      };
  };

//This will let you know when you have successfully logged in on your bot.
bot.once('ready', () => {
    console.log('Your bot is now online! |', `Logged in as ${bot.user.username}`);
    deploy();
});


bot.on('interactionCreate', async interaction => {
  if(!interaction.isCommand()) return;

  const command = bot.commands.get(interaction.commandName);

  if(!command) return;

  try{
    await command.execute(interaction);
  } catch (error) {
    console.log(error);
    await interaction.reply({content: 'Command was not found.'})
  }
})

bot.login(config.token);

