
// Runs the bot from the command line.
// airplane.js runs the bot from airplane.dev

require('dotenv').config();

function usage() {
  console.log('node main.js help|h');
  console.log('             servers|s|guilds|g');
  console.log('             channels|c');
  console.log('             message|msg|m <channel id> <msg>');
  console.log('             free-game-notifier|free <channel ids csv>');
  console.log('             get-free-epic-games|get');
}

function spaces(numSpaces) {
  let result = "";
  for (let i = 0; i < numSpaces; i++) {
    result += " ";
  }
  return result;
}

if (process.argv.length < 3) {
  usage();
  return -1;
}
const command = process.argv[2];
if (command !== 'servers'
  && command !== 's'
  && command !== 'guilds'
  && command !== 'g'
  && command !== 'channels'
  && command !== 'c'
  && command !== 'message'
  && command !== 'msg'
  && command !== 'm'
  && command !== 'free-game-notifier'
  && command !== 'free'
  && command !== 'get-free-epic-games'
  && command !== 'get'
) {
  usage();
  return -1;
}
if (
  (
    command === 'free-game-notifier'
    || command === 'free'
  )
  && process.argv.length < 4
) {
  usage();
  return -1;
}
if (
  (
    command === 'message'
    || command === 'msg'
    || command === 'm'
  )
  && process.argv.length < 5
) {
  usage();
  return -1;
}


if (command === 'free-game-notifier'
  || command === 'free'
) {
  const freeGameNotifierBot = require('./free-game-notifier-bot');
  freeGameNotifierBot.run(
    process.env.DISCORD_BOT_SECRET,
    process.argv[3].split(',')
  ).then(v => console.log(`bot ran with exit code ${v}`));
} else if (command === 'get-free-epic-games'
  || command === 'get'
) {
  const discord = require('discord.js');
  const getFreeEpicGames = require('./get-free-epic-games');
  getFreeEpicGames.get()
    .then(msg => console.log(msg));
} else {
  const discord = require('discord.js');
  const client = new discord.Client({
    intents: [
      discord.Intents.FLAGS.GUILDS,
      discord.Intents.FLAGS.GUILD_MESSAGES
    ]
  });
  client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    
    if (
         command === 'servers'
      || command === 's'
      || command === 'guilds'
      || command === 'g'
    ) {
      let servers = [];
      client.guilds.cache.forEach(server => {
        servers.push(server);
      });

      let maxLength = 0;
      servers.forEach(server => {
        if (server.name.length > maxLength) {
          maxLength = server.name.length;
        }
      });

      servers.forEach(server => {
        console.log(`${server.name} ${spaces(maxLength-server.name.length)} ${server.id}`);
        if (server.name.length > maxLength) {
          maxLength = server.name.length;
        }
      });

      client.destroy()
    } else if (command === 'channels' || command === 'c') { 
      let channels = [];
      client.channels.cache.forEach(channel => {
        if (channel.type === "GUILD_TEXT") {
          channels.push({
            channelId: channel.id,
            channelName: channel.name,
            serverName: channel.guild.name,
          });
        }
      });

      channels.sort((first, second) => {
        if (first.serverName < second.serverName) {
          return -1;
        } else if (first.serverName > second.serverName) {
          return 1;
        } else if (first.channelName < second.serverName) {
          return -1;
        } else if (first.channelName > second.serverName) {
          return 1;
        } else {
          return 0;
        }
      });

      let maxServerLength = 0;
      let maxChannelLength = 0;
      channels.forEach(channel => {
        if (channel.serverName.length > maxServerLength) {
          maxServerLength = channel.serverName.length;
        }
        if (channel.channelName.length > maxChannelLength) {
          maxChannelLength = channel.channelName.length;
        }
      });


      channels.forEach(channel => {
        console.log(`${channel.serverName} ${spaces(maxServerLength-channel.serverName.length)} ${channel.channelName} ${spaces(maxChannelLength-channel.channelName.length)} ${channel.channelId}`);
      });

      client.destroy()
    } else if (command === 'message' || command === 'msg' || command === 'm') { 
      const channelId = process.argv[3];
      const message = process.argv[4];
      let notSent = true;
      client.channels.cache.forEach(channel => {
        if (channel.id === channelId) {
          channel.send(message)
            .then( (v) => console.log("Message sent successfully."))
            .catch( (err) => console.log(`Failed to send message to ${channelId} due to ${err}`))
            .finally((v) => client.destroy()) ;
          notSent = false;
          return;
        }
      });
      if (notSent) {
        console.log(`${channelId} was not found`);
      }
    }

  });

  client.login(process.env.DISCORD_BOT_SECRET);
}
