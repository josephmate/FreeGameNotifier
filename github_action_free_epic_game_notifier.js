require('dotenv').config();
const freeGameNotifierBot = require('./free-game-notifier-bot');
const core = require('@actions/core');
const github = require('@actions/github');

/**
 * https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action
 * github will invoke this function.
 */
await freeGameNotifierBot.run(
    process.env.DISCORD_BOT_SECRET,
    params["channel_ids"].split(','),
);
