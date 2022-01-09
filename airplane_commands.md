Testing:
```
airplane dev ./airplane.js ./free-game-notifier-bot.js ./package.json
```

Deploying
```
airplane deploy ./airplane.js ./free-game-notifier-bot.js ./package.json
```

Installing:
```
brew install airplanedev/tap/airplane
airplane login
```

Starting a new project:
```
airplane init --slug=freegamenotifierbot
```

Cannot use latest discord.js. I will downgrade somehow.
Maybe it will still work even with the version mismatch?
```
[build freegamenotifierbot] npm WARN EBADENGINE Unsupported engine {
[build freegamenotifierbot] npm WARN EBADENGINE   package: 'discord.js@13.5.1',
[build freegamenotifierbot] npm WARN EBADENGINE   required: { node: '>=16.6.0',
npm: '>=7.0.0' },
[build freegamenotifierbot] npm WARN EBADENGINE   current: { node: 'v16.2.0',
npm: '7.13.0' }
[build freegamenotifierbot] npm WARN EBADENGINE }
```
