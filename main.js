
// Runs the bot from the command line.
// freegamenotifierbot.js runs the bot from airplane.dev

require('dotenv').config();

const discord = require('discord.js');
const client = new discord.Client({
  intents: [discord.Intents.FLAGS.GUILDS, discord.Intents.FLAGS.GUILD_MESSAGES]
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.destroy()
});

client.login(process.env.DISCORD_BOT_SECRET);

