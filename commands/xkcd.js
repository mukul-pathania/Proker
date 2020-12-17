module.exports = {
	name: 'xkcd',
	description: 'Get xkcd comic strips(random or a chosen one) and an link to explanation if you wish to understand it better.',
	usage: '[num]',
	cooldown: 3,
	aliases: [''],
	async execute(message, args) {
		message.channel.startTyping();
		const messageToDelete = message.channel.send('Processing your request...');
		const response = await getData(message, args);
		messageToDelete.then(msg => msg.delete({ timeout: 1 }));
		message.channel.stopTyping();
		if (response == -1) {
			return message.reply('An error occured while processing your request.');
		}
		const xkcdEmbed = await getEmbed(response);
		return message.channel.send({ embed: xkcdEmbed });
	},
};

const fetch = require('node-fetch');

function randomNumber(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}
async function getData(message, args) {
	const number = args[0] || randomNumber(1, 2399);
	const url = `https://xkcd.com/${number}/info.0.json`;
	// console.log(url);
	let data;
	try {
		data = await fetch(url).then(response => response.json());
		if ((!data) || (!data.num)) {
			return -1;
		}
		// console.log(data);
	}
	catch (exception) {
		return -1;
	}
	return { imageUrl: data.img, num: data.num };
}

async function getEmbed(imageData) {
	const xkcdEmbed = {
		color: 0x00FFFF,
		author: {
			name: 'xkcd',
			url: `https://xkcd.com/${imageData.num}`,
		},
		title: 'Explanation',
		url: `https://explainxkcd.com/wiki/index.php/${imageData.num}`,
		image: {
			url: imageData.imageUrl,
		},
		timestamp: new Date(),
	};

	return xkcdEmbed;
}