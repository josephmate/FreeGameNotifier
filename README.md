# FreeGameNotifier
Notifies Discord Channels of Free Games from Epic Games Store, hosted on ???


# Hosting

Ideal host would not require credit card validation so that it's easier for users to host their own version of the bot.
The load should only be about 10 seconds per week, well under many free tier limits.

Worst case, the user has to host the bot on their machine and leave it running
but that's wasteful.

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
