const discord = require('discord.js');

function connect(discordClientSecret) {
  const client = new discord.Client({
    intents: [
      discord.Intents.FLAGS.GUILDS,
      discord.Intents.FLAGS.GUILD_MESSAGES
    ]
  });
  return new Promise((resolve, reject) => {
    client.on('ready', () => {
      resolve(client);
    });
    client.on('warn', (info) => console.log(`WARNING: dicord client: ${info}`));
    client.on('error', (err) => reject(err));
    client.login(discordClientSecret);
  });
}

const runImpl = async function (
  discordClientSecret,
  channelIds
) {
  const channelIdSet = new Set();
  channelIds.forEach(channelId => {
    channelIdSet.add(channelId);
  });
  const sentChannelIdSet = new Set();
  let client = await connect(discordClientSecret);
  console.log(`Logged in as ${client.user.tag}!`);
  let promises = []
  client.channels.cache.forEach(channel => {
    if (channelIdSet.has(channel.id)) {
      console.log(`Sending to ${channel.id}`);
      promises.push(channel.send("Test message.")
        .then( (v) => sentChannelIdSet.add(channel.id))
        .catch( (err) => console.log(`Failed to send message to ${channel.id} due to ${err}`))
      );
    }
  });
      
  for (let i = 0; i < promises.length; i++) {
    await promises[i];
  }
  client.destroy()
      
  if ( sentChannelIdSet.size !== channelIdSet.size ) {
    return -1;
  } else {
    return 0;
  }
}

module.exports = {
  run: runImpl,
};

