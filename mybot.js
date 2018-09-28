const fs = require('fs');
const Discord = require("discord.js");
const client = new Discord.Client();

var bombTimeHr = 12
var bombTimer = null
var notificationTimer12 = null
var production = true;
var didWarn = false;
var niceCounter = 0;

var channel = new Discord.Channel();

var hrInMs;
if(production){
	hrInMs = 60 * 60 * 1000
}else{
	hrInMs = 1000
}


var trigMsg = "nice"

var discordToken = fs.readFileSync('discordToken.txt', { encoding: 'utf8'});
var channelID = fs.readFileSync('channelID.txt', { encoding: 'utf8'});

function armResetTimer(message){
	notificationTimer12 = setTimeout(() => {
		notificationTimer12 = null
		didWarn = true;
		message.channel.send("Channel will detonate in 1h\n\nTo reset bomb write nice.");

	}, (bombTimeHr - 1) * hrInMs)
}

function initBomb(message) {
	bombTimer = setTimeout(() => {
		bombTimer = null
//		message.channel.send("ded");
		console.log("BOOM");
		client.channels.get(channelID).delete();
	}, bombTimeHr * hrInMs)
	armResetTimer(message);
}

function armBomb(message, reset){
	console.log("bomb is armed");
//	message.channel.send("bomb has been activated! " + bombTimeHr + "h until detonation");
	initBomb(message);

}

function resetBomb(message){
	console.log("resetting bomb");
	clearTimeout(bombTimer);
	clearTimeout(notificationTimer12);
	if(didWarn === true) {
		message.channel.send("Bomb has been reset!");
		didWarn = false;
	}
	initBomb(message);
}

client.on("ready", () => {
  	console.log("I am ready!");
});


client.on("message", (message) => {
	console.log("We are on the", message.channel.id === channelID ? "right" : "wrong", "channel", "since this channel is", message.channel.id);
	if(message.channel.id == channelID){

		if (message.content.startsWith(trigMsg)) {
			console.log("got trigger");
			niceCounter += 1;
			if (bombTimer !== null) { //bombtimer is active
				console.log("clearing bomb");
				resetBomb(message);
			}	else { //bombtimer is not active
				armBomb(message, false);
			}
		}
	}
});

client.on("message", (message) => {
	if(message.channel.id == channelID){
		if (message.content.startsWith("!nicecount")) {
			message.channel.send(niceCounter + " 'nice' so far.");
		}
	}
})

client.login(discordToken);