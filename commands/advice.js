module.exports = {
	name: 'advice',
	description: 'Get advices that may be weird but still true.',
	usage: '',
	cooldown: 3,
	aliases: [''],
	async execute(message) {
		message.channel.startTyping();
		const messageToDelete = message.channel.send('Processing your request...');
		const advice = await getAdvice();
		messageToDelete.then(msg => msg.delete({ timeout: 1 }));
		message.channel.stopTyping();
		if (advice == -1) {
			return message.reply('An error occured while processing your request.');
		}
		return message.channel.send(advice.slip.advice);

	},
};

const fetch = require('node-fetch');


async function getAdvice() {
	const url = 'https://api.adviceslip.com/advice';
	// console.log(url);
	const advice = await fetch(url).then(response => response.json());
	// console.log(advice);
	if ((!advice) || (!advice.slip)) {
		return -1;
	}
	return advice;
}
