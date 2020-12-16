module.exports = {
	name: 'joke',
	description: 'Get random jokes',
	usage: '',
	cooldown: 3,
	aliases: [''],
	async execute(message) {
		message.channel.startTyping();
		const messageToDelete = message.channel.send('Processing your request...');
		let joke = await getJoke();
		messageToDelete.then(msg => msg.delete({ timeout: 1 }));
		message.channel.stopTyping();
		if (joke == -1) {
			return message.reply('An error occured while processing your request.');
		}
		joke = joke.replace(/&quot;/g, '\\"');
		return message.channel.send(joke);
	},
};

const fetch = require('node-fetch');

async function getJoke() {
	const url = 'https://sv443.net/jokeapi/v2/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist';
	const joke = await fetch(url).then(response => response.json());
	if ((!joke) || (joke.error)) {
		return -1;
	}
	let result;
	if (joke.type == 'twopart') {
		result = `${joke.setup}\n\n${joke.delivery}`;
	}
	else {
		result = joke.joke;
	}
	return result;
}
