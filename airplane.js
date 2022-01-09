// Linked to https://app.airplane.dev/t/freegamenotifierbot [do not edit this line]

const freeGameNotifierBot = require('./free-game-notifier-bot.js');

/**
 * airplane.dev will invoke this function.
 */
export default async function(params) {
  freeGameNotifierBot.run(params);
  return [
  ];
}
