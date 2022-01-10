// Linked to https://app.airplane.dev/t/freegamenotifierbot [do not edit this line]

require('dotenv').config();
const freeGameNotifierBot = require('./free-game-notifier-bot');

/**
 * airplane.dev will invoke this function.
 */
export default async function(params) {
  return await freeGameNotifierBot.run(
    process.env.DISCORD_BOT_SECRET,
    params["channel_ids"].split(','),
  );
}
