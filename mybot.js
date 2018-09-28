const fs = require('fs');
const Discord = require("discord.js");
const client = new Discord.Client();

var channelID = 492207584674185231;
var bombTimeHr = 24
var bombTimer = null
var notificationTimer12 = null
//var timeK = 60 * 60 * 1000
var timeK = 250
var trigMsg = "nice"

var discordToken = fs.readFileSync('discordToken.txt', { encoding: 'utf8'});

function armResetTimer(message){
	notificationTimer12 = setTimeout(() => {
		notificationTimer12 = null
		message.channel.send("T-" + (bombTimeHr)/2 + "h");

	}, (bombTimeHr * timeK)/2)
}

function initBomb(message) {
	bombTimer = setTimeout(() => {
		bombTimer = null
		message.channel.send("ded");
		console.log("BOOM");

	}, bombTimeHr * timeK)
	armResetTimer(message);
}

function armBomb(message, reset){
	console.log("bomb is armed");
	message.channel.send("bomb has been activated!" + bombTimeHr + "h until detonation");
	initBomb(message);

}

function resetBomb(message){
	console.log("resetting bomb");
	clearTimeout(bombTimer);
	clearTimeout(notificationTimer12);
	message.channel.send("Bomb has been reset!");
	initBomb(message);
}

client.on("ready", () => {
  console.log("I am ready!");
});


client.on("message", (message) => {
	if (message.content.startsWith(trigMsg)) {
		console.log("got trigger");
		if (bombTimer !== null) { //bombtimer is active
			console.log("clearing bomb");
			resetBomb(message);
		}	else { //bombtimer is not active
			armBomb(message, false);
		}
  }
});

client.login(discordToken);