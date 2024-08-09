# FreeGameNotifier
Notifies Discord Channels of Free Games from Epic Games Store, hosted on github actions. It runs every Thursday 19:00 UTC (12PM EST in the fall, spring EST in the fall).

# Running Locally

Setup:
```
cp load_secrets_template.sh load_secrets.sh
# fill in the secrets
vim load_secrets.sh
# run
. ./load_secrets.sh
node main.js
```

Testing:
```
node main.js free-game-notifier 929843391859163166
node main.js free-game-notifier 929843391859163166,929942967605669940
```

# Epic Store Free Game Payload
```
curl 'https://store-site-backend-static-ipv4.ak.epicgames.com/freeGamesPromotions?locale=en-US&country=CA&allowCountries=CA' | jq . 
{
  "data": {
    "Catalog": {
      "searchStore": {
        "elements": [
          {
            "title": "Offworld Trading Company",
            ...
            "urlSlug": "offworld-trading-company",
            ...
            "promotions": null
          },
          .
          .
          .
          {
            "title": "Gods Will Fall",
            ...
            "urlSlug": "gods-will-fall",
            ...
            "promotions": {
              "promotionalOffers": [
                {
                  "promotionalOffers": [
                    {
                      "startDate": "2022-01-06T16:00:00.000Z",
                      "endDate": "2022-01-13T16:00:00.000Z",
                      "discountSetting": {
                        "discountType": "PERCENTAGE",
                        "discountPercentage": 0
                      }
                    }
                  ]
                }
              ],
              "upcomingPromotionalOffers": []
            }
          },
          .
          .
          .
            "promotions": {
              "promotionalOffers": [],
              "upcomingPromotionalOffers": [
                {
                  "promotionalOffers": [
                    {
                      "startDate": "2022-01-13T16:00:00.000Z",
                      "endDate": "2022-01-20T16:00:00.000Z",
                      "discountSetting": {
                        "discountType": "PERCENTAGE",
                        "discountPercentage": 0
                      }
                    }
                  ]
                }
              ]
            }

```

1. response contains multiple promotions
2. entries with promotions: null can be ignored
3. one entry with promotion.promotionalOffers[0].promotionalOffers[0].startDate
   in the past is the free game (maybe multiple)
4. https://www.epicgames.com/store/p/<urlSlug> is the url
5. one entry with promotion.promotionalOffers[0].promotionalOffers[0].startDate
   in the future is next week's free game

https://www.epicgames.com/store/p/gods-will-fall

# Troubleshooting
You probably did not set the intents properly when you instantiated the discord
client.
```
TypeError [CLIENT_MISSING_INTENTS]: Valid intents must be provided for the Client.
    at Client._validateOptions (/Users/joseph/projects/FreeGameNotifier/node_modules/discord.js/src/client/Client.js:548:13)
    at new Client (/Users/joseph/projects/FreeGameNotifier/node_modules/discord.js/src/client/Client.js:76:10)
    at Object.<anonymous> (/Users/joseph/projects/FreeGameNotifier/main.js:9:16)
    at Module._compile (node:internal/modules/cjs/loader:1101:14)
    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1153:10)
    at Module.load (node:internal/modules/cjs/loader:981:32)
    at Function.Module._load (node:internal/modules/cjs/loader:822:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:79:12)
    at node:internal/main/run_main_module:17:47 {
```

Something is wrong with your token:
```
/Users/joseph/projects/FreeGameNotifier/node_modules/discord.js/src/client/Client.js:237
    if (!token || typeof token !== 'string') throw new Error('TOKEN_INVALID');
                                                   ^

Error [TOKEN_INVALID]: An invalid token was provided.
    at Client.login (/Users/joseph/projects/FreeGameNotifier/node_modules/discord.js/src/client/Client.js:237:52)
    at Object.<anonymous> (/Users/joseph/projects/FreeGameNotifier/main.js:17:8)
    at Module._compile (node:internal/modules/cjs/loader:1101:14)
    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1153:10)
    at Module.load (node:internal/modules/cjs/loader:981:32)
    at Function.Module._load (node:internal/modules/cjs/loader:822:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:79:12)
    at node:internal/main/run_main_module:17:47 {
```

# Hosting

Ideal host would not require credit card validation so that it's easier for users to host their own version of the bot.
The load should only be about 10 seconds per week, well under many free tier limits.

Worst case, the user has to host the bot on their machine and leave it running
but that's wasteful.

- **MAYBE**: begin.com has scheduled functions and does not need a cc. However,
  they do not let you pick a time. I need it to run once a week around 11AM EST on
Thursday.

> Limits
> 
> In the Begin free-tier, scheduled functions are limited in the following ways:
> 
>     They can run no more frequently than once every 6 hours
>     30 seconds of execution time
> 
> Begin paid-tier apps are not limited in these ways.
> 
> Another important thing to note: AWS does not guarantee the exact time of
> execution. So while you can request a scheduled function runs twice daily, you
> cannot specify that it run at noon and midnight – it may always run at 2:04 PM &
> 2:04 AM, for example.

- **MAYBE**: PythonAnywhere looks like it has scheduled tasks that you can run
  at most once per day on free tier. However, it is limited to running once per
  day.
  https://help.pythonanywhere.com/pages/ScheduledTasks/
- **NO**: SAP discontinued their *SAP BTP, Serverless Runtime* :
  https://blogs.sap.com/2021/10/18/sap-btp-serverless-runtime-to-be-discontinued-and-replaced-by-sap-btp-kyma-runtime-and-sap-integration-suite/
- **NO**: DigitalOcean requires Kubernetes cluster installed with OpenFaaS
- **NO**: Heroku's Scheduler addon requires CC verification. Only get 550 hours.
         There are 730 hours per month so there will be downtime.
         Without the scheduler it would just sit around waiting for the next
         week to arrive. This is an extremely wasteful solution.
- **NO**: Firebase Functions requires 'Blaze' pay as you go which requires CC
- **NO**: AWS Lambda requires CC 
- **NO**: Azure Functions requires CC
- **NO**: Google Cloud Functions requires CC

Unexplored:

- https://www.easycron.com/
- cron-job.org
