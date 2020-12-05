module.exports = {
	name: 'chuckjoke',
	description: 'Get Chuck Norris jokes which can optionally have a different hero.',
	usage: '[firstname lastname]',
	async execute(message, args) {
		message.channel.startTyping();
		const messageToDelete = message.channel.send('Processing your request...');
		const firstName = args[0] || 'Chuck';
		const lastName = args[1] || 'Norris';
		let joke = await getJoke(firstName, lastName);
		messageToDelete.then(msg => msg.delete({ timeout: 1 }));
		message.channel.stopTyping();
		if (joke == -1) {
			return message.reply('An error occured while processing the request.');
		}
		// console.log(joke);
		joke = joke.replace(/&quot;/g, '\\"');
		// console.log(joke);
		return message.channel.send(joke);

	},
};

const fetch = require('node-fetch');
const queryString = require('querystring');

async function getJoke(firstName, lastName) {
	const query = queryString.stringify({ firstName, lastName });
	const url = `https://api.icndb.com/jokes/random?${query}`;
	console.log(url);
	const joke = await fetch(url).then(response => response.json());
	if ((!joke) || joke.type != 'success') {
		return -1;
	}
	console.log('Joke: ' + joke.value.joke);
	return joke.value.joke;
}