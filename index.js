const steamUser = require('steam-user');
const steamTotp = require('steam-totp');
const path = require('path');
var fs = require('fs');
var async = require('async');
const GitHub  = require('github-api')


config = require(path.resolve('config.json'));

let configRaw = fs.readFileSync('./config.json').toString();
var git_config = {};
var gh 
var repo
if (config.remote_control == true) {
	gh = new GitHub({ token: config.github_token });
	repo = gh.getRepo(config.github_username, "json");
	repo.getContents("main", "config.json", false, function(error, result, request) {
		if ((error == null) && (request.statusText == 'OK')) {
				let buff = Buffer.from(request.data.content, 'base64'); 
				git_config = JSON.parse(buff.toString('ascii')); 
		}
	})
}

function git_json(data) {
	repo.writeFile("main", "config.json", JSON.stringify(data), "from_heroku", function(error, result, request) {
		if ((error == null) && (request.statusText == 'OK')) {
			console.log('github config is changed')
		}
	})
}

function add_json(param) {
	fs.writeFile ("config.json", JSON.stringify(param), function(err) {
	    if (err) throw err;
	    console.log('Config is changed');
	    }
	);
	if (config.remote_control == true) 	git_json(param)
}

var hold = true;
var check_bot = false;
var temp_key = "";
var temp_code = "";

users = config.users;
var user = [];

bot = new steamUser();
if (config.shared_secret !="") bot.logOn({"accountName": config.username, "password": config.password, "twoFactorCode": steamTotp.generateAuthCode(config.shared_secret)});
if (config.shared_secret =="") bot.logOn({"accountName": config.username, "password": config.password});
bot_playing = config.bot_playing;
persona = config.persona;

function dublicate(data) {
	for (let i = 0; i < data.length; i++) {
		for (let j = 0; j < data.length; j++) {
			if ((data[i] == data[j]) && (i != j)) data.splice(j,1)
		}
	}
}

bot.on('loggedOn', () => {
	if (bot.steamID != null) {
		console.log(bot.steamID + ' - Successfully logged on');	
		
		console.log(git_config);
		check_bot = true;
	}
	bot.setPersona(config.persona);               
	bot.gamesPlayed(config.bot_playing);
});


bot.on('friendMessage', function(steamID, message) {
	if (steamID == config.main) {
		if (message.startsWith('!help')) {
			bot.chatMessage(config.main, '!help - list of commands,\n!info - whats happening right now,\n\n-------- Idling congiguration --------\n!login <username> - login if you logged off before,\n!logoff <username> - logoff,\n!add <username> <password> - add a new account to idle (default: 730, invisible),\n!add <username> <password> <shared_secret> - if you have a shared secred code,\n!remove <username/all> - remove acc/accs from the idling (logoff then remove from the config),\n!status <username> <number> - set status (1 - online, 7 - invisible),\n!addgame <username/all> <appID> - add a game to the idler (number, string, or list). For example: !addgame gunther 730,570,time_boost,400 ,\n!clear <username/all> - clear the game list,\n!stop <username/all> - stop idling (it isnt logOff),\n!start <username/all> - start idling if you stopped it.\n\n-------- Bot configuration --------\n!bot_playing <appsID> - set apps for the bot,\n!bot_status <num> - status for the bot (1 - online, 7 - invisible)'); 
		}
		if (message.startsWith('!login') || message.startsWith('!logoff')  || message.startsWith('!status')) {
			var usern = message.split(' ')[1];
			var state = parseInt(message.split(' ')[2]);
			if (isNaN(state)) state = 1;
			for (var j in users) {
				if (users[j].user == usern) {
					if (message.startsWith('!login')) { users[j].logged = true; config.users[j].logged = true; add_json(config); auth(user[j], users[j].user, users[j].password, users[j].shared_secret, users[j].key, users[j].persona, users[j].games, j, users[j].logged); }
					if (message.startsWith('!logoff')) { user[j].logOff(); users[j].logged = false; config.users[j].logged = false; add_json(config); bot.chatMessage(config.main, users[j].user + ' is disconnected')}
					if (message.startsWith('!status')) { user[j].setPersona(state);	config.users[j].persona = state; users[j].persona = state; add_json(config); bot.chatMessage(config.main, users[j].user + ' changed status to '+ state)}
				}
			}
		}

		else if (message.startsWith('!info')) {
			var info = "Info:";
			for (var i in user) {		
				var add = "\n"+ (i) +": " + users[i].user + ", logged: " + users[i].logged + ", Games playing: " + users[i].games + ", status: " + users[i].persona
				info = info.concat(add);
			}
			bot.chatMessage(config.main, info)
		}
		else if (message.startsWith('!addgame')) {
			var usern = message.split(' ')[1];
			var gamesp = message.split(' ')[2];
			gamesp = gamesp.split(",")
			for (var i in gamesp) {
				var gm = parseInt(gamesp[i]);
				if (isNaN(gm)) {} else { gamesp[i] = gm }
			}
			if (usern == "all") {
				for (var j in users) {
					users[j].games = users[j].games.concat(gamesp); dublicate(users[j].games); config.users[j].games = users[j].games; add_json(config);
					user[j].gamesPlayed(users[j].games);
				}
				bot.chatMessage(config.main, "all acc is playing: " + users[0].games)
			}
			else {
				for (var j in users) {
					if (users[j].user == usern) {
						users[j].games = users[j].games.concat(gamesp); dublicate(users[j].games); config.users[j].games = users[j].games; add_json(config);
						user[j].gamesPlayed(users[j].games);
						bot.chatMessage(config.main, users[j].user + " is playing: " + users[j].games)
					}
				}
			}
		}


		else if (message.startsWith('!clear')) {
			var usern = message.split(' ')[1];
			if (usern == "all") {
				for (var j in users) {
					users[j].games = []; config.users[j].games = users[j].games; add_json(config);
					user[j].gamesPlayed(users[j].games);
				}
				bot.chatMessage(config.main, "all acc is playing: " + users[0].games)
			}
			else {
				for (var j in users) {
					if (users[j].user == usern) {
						users[j].games = []; config.users[j].games = users[j].games; add_json(config);
						user[j].gamesPlayed(users[j].games);
						bot.chatMessage(config.main, users[j].user + " is playing: " + users[j].games)
					}
				}
			}
		}


		else if (message.startsWith('!start') || message.startsWith('!stop')) {
			var usern = message.split(' ')[1];
			if (usern == "all") {
				for (var j in users) {
					if (message.startsWith('!stop')) user[j].gamesPlayed()
					else if (message.startsWith('!start'))	user[j].gamesPlayed(users[j].games);
				}
				if (message.startsWith('!stop')) bot.chatMessage(config.main, "Stopped for all accs")
				else if (message.startsWith('!start'))	bot.chatMessage(config.main, "Started for all accs")
				
			}
			else {
				for (var j in users) {
					if (users[j].user == usern) {
						if (message.startsWith('!stop')) { user[j].gamesPlayed(); bot.chatMessage(config.main, "Stopped for " + users[j].user) }
						else if (message.startsWith('!start'))	{ user[j].gamesPlayed(users[j].games); bot.chatMessage(config.main, "Started for " + users[j].user) }
					}
				}
			}
		}

		else if (message.startsWith('!remove')) {
			var usern = message.split(' ')[1];
			if (usern == "all") {
				for (var j in users) {
					user[j].logOff();
					users[j].logged = false; config.users[j].logged = false; add_json(config); 
				}
				users = []; config.users = users; user = []; add_json(config);
				bot.chatMessage(config.main, "Removed all accounts");
			}
			else {
				for (var j in users) {
					if (users[j].user == usern) {				
						user[j].logOff();
						users[j].logged = false; config.users[j].logged = false;
						user.splice(j, 1);
						users.splice(j, 1); config.users = users; add_json(config);
						bot.chatMessage(config.main, "[" + usern + "] Removed from the config");
					}
				}
			}
		}
		else if (message.startsWith('!add')) {
			var usern = message.split(' ')[1];
			var passw = message.split(' ')[2];
			var shared = message.split(' ')[3];
			console.log(usern, passw)
			if ((usern != undefined) && (usern != undefined)) {
				if (shared != undefined) var elem = {"user":usern,"password":passw,"shared_secret":shared,"key":"","games":[730],"persona":7,"logged":false}
				else var elem = {"user":usern,"password":passw,"shared_secret":"","key":"","games":[730],"persona":7,"logged":false}
				users.push(elem); config.users = users; add_json(config); 
				user[user.length] = new steamUser();
				bot.chatMessage(config.main, "[" + usern + "] added to the config. Use !login "+ usern);
			}
		}

		else if (message.startsWith('!bot_playing')) {
			var gamesp = message.split(' ')[1];
			gamesp = gamesp.split(",")
			for (var i in gamesp) {
				var gm = parseInt(gamesp[i]);
				if (isNaN(gm)) {} else { gamesp[i] = gm }
			}
			dublicate(gamesp);
			bot_playing = gamesp; config.bot_playing = bot_playing; add_json(config);
			bot.gamesPlayed(bot_playing);
		}
		else if (message.startsWith('!bot_status')) {
			var stat = message.split(' ')[1];
			if (isNaN(stat)) stat = 1;
			persona = stat; config.persona = persona; add_json(config);
			bot.setPersona(persona);
		}

		else {	temp_code = message; hold = false; }
	}
});


function login(user, username, password, shared_secret, loginKey="") {
	if (shared_secret != "") user.logOn({"accountName": username, "password": password, "twoFactorCode": steamTotp.generateAuthCode(shared_secret),"rememberPassword": true, "machineName": "DESKTOP-TQ6A7777", "clientOS": 16})
	else if (loginKey != "") user.logOn({"accountName": username, "loginKey": loginKey, "rememberPassword": true, "machineName": "DESKTOP-TQ6A7777", "clientOS": 16})
	else user.logOn({"accountName": username, "password": password,"rememberPassword": true, "machineName": "DESKTOP-TQ6A7777", "clientOS": 16});
};

async function sleepUntil(f, timeoutMs) {
    return new Promise((resolve, reject) => {
        let timeWas = new Date();
        let wait = setInterval(function() {
            if (f()) {
                console.log("resolved after", new Date() - timeWas, "ms");
                clearInterval(wait);
                resolve();
            } else if (new Date() - timeWas > timeoutMs) { // Timeout
                console.log("rejected after", new Date() - timeWas, "ms");
                clearInterval(wait);
                resolve();
            }
        }, 20);
    });
}

function auth(user, username, pass, shared_secret, loginKey, state, games, number, logged) {

	if (logged == true) login(user, username, pass, shared_secret, loginKey);
	if (logged == false) { bot.chatMessage(config.main, "[" + username + "] You logged off this acc before, use: !login " + username); holdd = false; }

	user.on('steamGuard', async function(domain, callback, lastCodeWrong) {
		hold = true;
		console.log("Steam Guard code needed");
		
		if (shared_secret !="") {
			var code = steamTotp.generateAuthCode(shared_secret)
			callback(code);
		}
		else {
			bot.chatMessage(config.main, "Enter a guard code for " + username);
			await sleepUntil(() => !hold, 120000);
			var code = temp_code;
			callback(code);
		}

	});

	user.on('loggedOn', () => {
		if (user.steamID != null) {
			console.log(username + ' - Successfully logged on');
			hold = false; holdd = false;
			bot.chatMessage(config.main, '----------\n' + username + ' - Successfully logged on\nStatus: ' + state + '\nGames: ' + games + '\n----------');
		}
		user.setPersona(state);               
		user.gamesPlayed(games, force = true);
	});


	user.on('loginKey', function(key) {
		temp_key = key;	
		config.users[number].key = key;
		users[number].key = key;
		add_json(config);
	});

	user.on('disconnected', function(msg) {
		console.log(username + ' disconnected, reason: ' + msg);
		bot.chatMessage(config.main, username + 'disconnected, reason: ' + msg);
		if (logged == false) {
			user.autoRelogin = false;
		}
	});

	user.on('playingState', function(blocked, playingApp) {
		if (blocked == true) {
			bot.chatMessage(config.main, username + ' - playing on another device. Game: ' + playingApp);
		}
	})


	user.on('error', function(err) {
		if (err == "Error: RateLimitExceeded") {
			console.log(username + ' - rate limit');
			bot.chatMessage(config.main, username + ' - rate limit!!! Wait 5 mins and then use: !login ' + username);
			users[number].logged = false; config.users[number].logged = false; add_json(config);
			user.logOff(); holdd = false;
		}
		else if (err == "Error: InvalidPassword") {
			if (loginKey != "") {
				console.log(username + ' - bad key');
				bot.chatMessage(config.main, username + ' - loginKey is outdated. lets make a new one...');
				loginKey = "";
				login(user, username, pass, shared_secret, loginKey);
			}
			else {
				console.log(username + ' - bad password');
				bot.chatMessage(config.main, username + ' - password is wrong');
			}
		}
		else if (err == "Error: LoggedInElsewhere") {
			bot.chatMessage(config.main, '[' + username + '] Playing on another device right now. Use !login ' + username);
			users[number].logged = false; config.users[number].logged = false; add_json(config);
			user.logOff();
		}	
		else {
			console.log(username + ' - ERROR');
			bot.chatMessage(config.main, username + ' - ERROR: ' + err);
			user.logOff(); holdd = false;
		}
	
	});



	// user.storage.on('save', function(filename, contents, callback) {
	// 	repo.writeFile("main", filename, content, "heroku", function(error, result, request) {
	// 		if (error == null) {
	// 			console.log('github sentry is changed')
	// 		}
	// 	})
	// })
	//user.storage.on('read', function(filename, callback) {
		// repo.getContents("main", filename, false, function(error, result, request) {
		// 	if (error) {
		// 		console.log(error)
		// 		return
		// 	}
		// 	var file = Buffer.from(request.data.content, 'base64');  
		// 	callback(file)
		// })
		
	//})

};


var holdd = false;



(async() => {
	await sleepUntil(() => check_bot, 50000);
	await new Promise(resolve => setTimeout(resolve, 5000));

	if ((git_config != {}) && (config.remote_control == true)) { 
		config = git_config; 
		users = git_config.users
		bot.setPersona(config.persona);               
		bot.gamesPlayed(config.bot_playing);
	}
	for (let i = 0; i < users.length; i++) {
		await new Promise(resolve => setTimeout(resolve, 5000));
		user[i] = new steamUser({"machineIdType": 4});
		auth(user[i], users[i].user, users[i].password, users[i].shared_secret, users[i].key, users[i].persona, users[i].games, i, users[i].logged);
		holdd = true;
		await sleepUntil(() => !holdd, 120000);
	}

})();
