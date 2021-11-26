const SteamUser = require('steam-user');
const path = require('path');
var fs = require('fs');

config = require(path.resolve('config.json'));
let configRaw = fs.readFileSync('./config.json').toString();

const user = new SteamUser();
const user1 = new SteamUser();

var username;
var password;
var guard;
var persona = config.persona;
var games = config.games;
var user_message_id;

function add_json(param) {
	fs.writeFile ("config.json", JSON.stringify(param), function(err) {
	    if (err) throw err;
	    console.log('complete');
	    }
	);
}


const logOnOptions = {
	accountName: config.username,
	password: config.password
}

user.logOn(logOnOptions);


user.on('loggedOn', () => {
	console.log(logOnOptions.accountName + ' - Successfully logged on');
	user.setPersona(1);               
	user.gamesPlayed('time boost');    
});

user.on('friendMessage', function(steamID, message) {
	user_message_id = steamID.getSteamID64()
	if (message.startsWith('!help')) {
		user.chatMessage(steamID.getSteamID64(), '!help - list of commands\n!login <username> <password> - set username and password\n!status <number> - set status (1 - online, 7 - invisible)\n!addgame <appID> - add a game to the idler\n!gamelist - current game list\n!gameclear - clear the game list\n!guard <guard code> - enter steam guard code to authorize\n!stop - stop idling\n!start - start idling if you stopped it.'); 
	}

	if (message.startsWith('!login')) {
		username = message.split(' ')[1]; password = message.split(' ')[2];
		user.chatMessage(steamID.getSteamID64(), 'username and password are added. To authorize use: !guard <guard code>');
	}
	if (message.startsWith('!guard')) {
		var guard = message.split(' ')[1];
		user1.logOn({"accountName": username, "password": password, "twoFactorCode": guard });
	}

	if (message.startsWith('!status')) {
		var persona_text = message.split(' ')[1]
		if ((persona_text == '1') || (persona_text == '2') || (persona_text == '3') || (persona_text == '4') || (persona_text == '5') || (persona_text == '6') || (persona_text == '7')) {
			persona = parseInt(persona_text, 10)
			if (persona==1)	user.chatMessage(steamID.getSteamID64(), 'Status is Online'); 
			else if (persona==7) user.chatMessage(steamID.getSteamID64(), 'Status is Invisible');
			user1.setPersona(persona);
			config.persona = persona;
			add_json(config);
		}
		else user.chatMessage(steamID.getSteamID64(), 'Enter !status <number>\n1 - online, 7 - invisible');
	}

	if (message.startsWith('!start')) {
		if (user1.steamID != null) {
			user1.setPersona(persona);                
			user1.gamesPlayed(games); 
			user.chatMessage(user_message_id, username + ' - Started\nStatus: ' + persona + '\nGames: ' + games);
		}
	}
	if (message.startsWith('!stop')) {
		if (user1.steamID != null) {                
			user1.gamesPlayed(); 
			user.chatMessage(user_message_id, username + ' - Stopped\nStatus: ' + persona + '\nGames: ' + games);
		}
	}

	if (message.startsWith('!gameclear')) {
        games = []
        config.games = games;
		add_json(config);
        user1.gamesPlayed(games);
        user.chatMessage(user_message_id, 'Game list is clear, Gamelist: ' + games);
	}
	if (message.startsWith('!gamelist')) {
        user.chatMessage(user_message_id, 'Gamelist: ' + games);
	}
	if (message.startsWith('!addgame')) {
		var game_text = parseInt(message.split(' ')[1], 10)
		games.push(game_text)
		config.games = games;
		add_json(config);
        user.chatMessage(user_message_id, 'Gamelist: ' + games);
	}


});

user1.on('loggedOn', () => {
	user.chatMessage(user_message_id, username + ' - Successfully logged on\nStatus: ' + persona + '\nGames: ' + games);
	user1.setPersona(persona);                
	user1.gamesPlayed(games); 
	user.chatMessage(user_message_id, user1.steamID)
});