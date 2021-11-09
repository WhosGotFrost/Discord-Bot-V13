//Discord v13 uses its API to push and deploys commands.
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const config = require('./config.json');
const fs = require('fs');

exports.deploy = function commandWatcher() {
  const commands = [];

  //This command handler pushes the commands within the folders into an array and converts it into JSON format for the Discord API to read your commands.
  const commandFolders = fs.readdirSync('./commands');
    for (const folder of commandFolders){
      const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
        for (const file of commandFiles){
          const command = require(`./commands/${folder}/${file}`);
          commands.push(command.data.toJSON());
        };
    };

  const rest = new REST({ version : '9'}).setToken(config.token);

  //This will add commands to your personal application (bot) on Discord V13's API.
  (async () => {
      try {
        console.log('Started refreshing application (/) commands.');
    
        //for your personal guild (server).
        await rest.put(
          Routes.applicationGuildCommands(config.botID, config.guildID),
          { body: commands },
        );

        //This is for all guilds (servers).
        
        // await rest.put(
        //     Routes.applicationCommands(config.botID),
        //     { body: commands },
        // );
    
        console.log('Successfully reloaded application (/) commands.');
      } catch (error) {
        console.error(error);
      }
    })();
};



