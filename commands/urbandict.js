module.exports = {
	name: 'urbandict',
	description: 'Lookup the urban dictionary for a term.',
	usage: 'search-term',
	async execute(message, args) {
		message.channel.startTyping();
		const messageToDelete = message.channel.send('Processing your request...');
		const result = await getTerm(message, args);
		messageToDelete.then(msg => msg.delete({ timeout: 1 }));
		message.channel.stopTyping();
		if (result == -1) {
			return message.reply('You need to supply a search term!');
		}

		return message.channel.send(result);
	},
};

const { MessageEmbed } = require('discord.js');
const querystring = require('querystring');
const fetch = require('node-fetch');

const trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);

async function getTerm(message, args) {
	if (!args.length) {
		return -1;
	}
	const query = querystring.stringify({ term: args.join(' ') });
	const url = `https://api.urbandictionary.com/v0/define?${query}`;
	const { list } = await fetch(url).then(response => response.json());
	if (!list.length) {
		return `No results found for **${args.join(' ')}**.`;
	}

	const [answer] = list;

	const embed = new MessageEmbed()
		.setColor('#00FFFF')
		.setTitle(answer.word)
		.setURL(answer.permalink)
		.addFields(
			{ name: 'Definition', value: trim(answer.definition, 1024) },
			{ name: 'Example', value: trim(answer.example, 1024) },
			{ name: 'Rating', value: `${answer.thumbs_up} thumbs up. ${answer.thumbs_down} thumbs down.` },
		);

	return embed;
}

