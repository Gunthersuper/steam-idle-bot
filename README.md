# steam-idle-bot
Ingame hours boost for Steam with Heroku

![img](https://i.imgur.com/huipgSw.png)

### Features:
1. The steam idler works 24/7 (deployed on Heroku)
2. If your steam account is connected to mobile authenticator you have to enter a guard code in the chat <b>every 24h</b>
3. If your accounts connected to SDA you dont need to enter the guard code (use the `shared_secret`)
4. You can idle upto 32 games for each account (+ one custom game)
5. You can add as many steam accounts as you want (im not sure about any limits. I managed to add 25 accs)
6. <b>IMPORTANT:</b> Heroku restarts every 24h and it doesnt saves any actions from the chat (like `!add`, `!remove`, `!addgame`, etc), so you have to make all the needed configuration in the `config.json` before you run the  bot on Heroku,
7. <b>OR</b> you can use the github repo to save all changes from the chat permanently (needs to have a github account)



<b>Requirements:</b>
1. Install Git: https://git-scm.com/downloads
2. Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli
3. Register at https://heroku.com
4. Register a new steam account (it will be a bot), disable steam guard, add to friend this acc from your main
5. (Optional) Register a new Github account: https://github.com/

<b>Setting up:</b>
1. Open PowerShell (or teminal) in any folder you want. Enter:
    - `git config --global user.email YOUR EMAIL `
    - `git clone https://github.com/Gunthersuper/steam-idle-bot`
2. A new folder `steam-idle-bot` will appeared in this directory. Go to this folder.
3. Open `config.json`, fill the needed information:
  - `"remote_control":true,` - `true` if you use a github repo to save and read the config.json (optional, <b>section 3.1</b>)
  - `"github_token":"your_github_token",` - settings -> Developer settings -> Personal access tokens -> Generate new token (optional)
  - `"github_username":"your_github_username",` - Enter your github username (optional)
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
  "remote_control":true,
  "github_token":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
  "github_username":"gunthersuper",
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

**3.1. Github repo to save changes in the `config.json` permanently (`"remote_control":true`)**
- You started the idler on Heroku, then added more accs using the chat coomands (`!add username password`), but Heroku restarts every 24h and doesnt save any changes in the config so you lose this changes, and you have to add this accs to the `config.json` before the deploying. And if you want to add more accs after you deployed the idler, you need to stop it, add accs to the config, then enter: `git add config.json`, `git commit -m "commit"`, `git push heroku main`, `heroku ps:scale web=0`, `heroku ps:scale bot=1`
- But you can fix that problem:
  - Register a Github account if you havent one.
  - Go to: settings -> Developer settings -> Personal access tokens -> Generate new token ![img](https://i.imgur.com/pHHz5gg.png)
  - Enter some note, click Generate new token. Copy this token and paste to the `config.json` to the `"github_token"` parameter.
  - Enter your github username to the `config.json` to the `"github_username"` parameter.
  - Make a new repository. ![img](https://i.imgur.com/O21QNdz.png) 
  - Name it json. **Make it private**  
![img](https://i.imgur.com/We01KvV.png)
  - Upload the `config.json` to the created repository, click on _uploading an existing files_
![img](https://i.imgur.com/VjvtkXa.png)
  - Select your config file, and click _commit changes_
![img](https://i.imgur.com/ANw9ICc.png)
  - So you will get this repo:
![img](https://i.imgur.com/slcOnm8.png)
- If you dont want to add/remove accs, set games to idle or set status of your accs in the chat with the bot you can just make this:
```
  "remote_control":false,
  "github_token":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
  "github_username":"",
```

4. **Deploying:** Open the console in the same folder (SHIFT + right mouse, open PowerShell window here, if you use Windows), enter the next commands:
    - `git add .`
    - `git commit -m 'commit'`
    - `heroku login`
Then login in your browser
    - `heroku create`
    - `git push heroku main`
    - `heroku ps:scale web=0`
    - `heroku ps:scale bot=1`


5. Then it will try to login to the accs in the config. If you need to enter a guard code you will receive a message about it. Enter the guard code in the chat.
6. To stop the idler enter: `heroku ps:scale bot=0`
7. To start it again: `heroku ps:scale bot=1`

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
