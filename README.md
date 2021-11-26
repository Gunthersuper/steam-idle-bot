# steam-idle-bot
Ingame hours boost for Steam with Heroku

<b>Requirements:</b>
1. Install Git: https://git-scm.com/downloads
2. Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli
3. Register at https://heroku.com
4. Register a new steam account (it will be a bot), disable steam guard, add to friend this acc from your main.

<b>Setting up:</b>
1. Download this repo (`Code` -> `Download ZIP`), unpack to any location.
2. Open `config.json`, fill `username` and `password` of the bot steam account (just created).
3. Open the console in the same folder (SHIFT + right mouse, open PowerShell window here, if you use Windows), enter the next commands:

`git init`

`git add .`

`git commit -m 'commit'`

`heroku login`

Then login in your browser

`heroku create`

`git push heroku master`

`heroku ps:scale web=0`

`heroku ps:scale bot=1`

<b>Using:</b>
1. Open chat with steam account you just created.
2. `!status <number>` - to set status, 1 - online, 7 - invisible. For example, `!status 7`
3. `!addgame <appID>` - add a game to farm. For example, `!addgame 730` to add CS:GO
4. `!gameclear` - to remove all games from game list for idling.
5. `!gamelist` - to show the curren game list for idling.
6. `!login <username> <password>` - enter username and password of your steam acc that you want to farm.
7. `!guard <guard code>` - to authorize and start idling.
8. `!start` and `!stop` - start and stop xD.
