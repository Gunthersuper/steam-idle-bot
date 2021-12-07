# steam-idle-bot
Ingame hours boost for Steam with Heroku

## Im progress ...



<b>Requirements:</b>
1. Install Git: https://git-scm.com/downloads
2. Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli
3. Register at https://heroku.com
4. Register a new steam account (it will be a bot), disable steam guard, add to friend this acc from your main.

<b>Setting up:</b>
1. Open PowerShell (or teminal) in any folder you want. Enter:
    - `git config --global user.email YOUR EMAIL `
    - `git clone https://github.com/Gunthersuper/steam-idle-bot`
2. A new folder `steam-idle-bot` will appeared in this directory. Go to this folder.
3. Open `config.json`, fill the needed information:

  - `"username":"your_bot_username",` - enter your bot account username (not main)
  - `"password":"your_bot_password",` - enter your bot account password
  - `"shared_secret":"",` - if your bot connectet to the SDA (if not just leave blank)
  - `"main":"your_main_steamID",` - Steam ID of your main account, can be obtained here https://steamdb.info/calculator/
  - `"bot_playing":["time boost",730,570,440],` - Games that your bot will play (can be changed in the chat)
  - `"persona":"1",` - status of your bot, 1 - online, 7 - invisible (can be changed in the chat)
  - `"users":[` - array that contains info about idling accs (can be add/remove/changed in the chat)
    - `{"user":"your_username",` - username
    - `"password":"your_password",` - password
    - `"shared_secret":"",` - if this acc is connected to the SDA and you can get the shared_secret
    - `"key":"",` - leave this as "" (login key)
    - `"games":[570,440,730],` - games that this acc will play (can be changed in the chat)
    - `"persona":1,` - status of this acc, 1 - online, 7 - invisible (can be changed in the chat)
    - `"logged":true}`
 
config.json example:
```
{
  "username":"gunther_bot",
  "password":"touchmenowww", 
  "shared_secret":"",
  "main":"76561198261256059",
  "bot_playing":["time boost",730,570,440],
  "persona":"1",
  "users":[
    {"user":"gunthersuper","password":"pass12345","shared_secret":"","key":"","games":[570,440,730],"persona":1,"logged":true}
  ]
}
```
You can use more than one account to idle:
```
"users":[
    {"user":"gunthersuper","password":"pass12345","shared_secret":"","key":"","games":[570,440,730],"persona":1,"logged":true},
    {"user":"gunther2","password":"pass12345","shared_secret":"","key":"","games":[730],"persona":7,"logged":true},
    {"user":"gunther3r","password":"pass12345","shared_secret":"","key":"","games":[440,730],"persona":1,"logged":true}
  ]
```


4. Open the console in the same folder (SHIFT + right mouse, open PowerShell window here, if you use Windows), enter the next commands:
    - `git add .`
    - `git commit -m 'commit'`
    - `heroku login`
Then login in your browser
    - `heroku create`
    - `git push heroku main`
    - `heroku ps:scale web=0`
    - `heroku ps:scale bot=1`

5. Then it will try to login to the accs in the config. If you need to enter a guard code you will receive a message about it. Enter the guard code in the chat.

<b>Using:</b>
Open chat with steam account you just created. `!help` command will help you with this bot.
```
!help - list of commands,
!info - whats happening right now,

-------- Idling congiguration --------
!login <username> - login if you logged off before,
!logoff <username> - logoff,
!add <username> <password> - add a new account to idle (default: 730, invisible),
!add <username> <password> <shared_secret> - if you have a shared secred code,
!remove <username/all> - remove acc/accs from the idling (logoff then remove from the config),
!status <username> <number> - set status (1 - online, 7 - invisible),
!addgame <username/all> <appID> - add a game to the idler (number, string, or list). For example: !addgame gunther 730,570,time_boost,400 ,
!clear <username/all> - clear the game list,
!stop <username/all> - stop idling (it isnt logOff),
!start <username/all> - start idling if you stopped it.

-------- Bot configuration --------
!bot_playing <appsID> - set apps for the bot,
!bot_status <num> - status for the bot (1 - online, 7 - invisible)
```
