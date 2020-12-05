module.exports = {
	name: 'server',
	description: 'Display info about this server.',
	execute(message) {
		if (message.channel.type == 'dm') {
			message.channel.send('This command does not work in DM\'s');
			return;
		}
		const helpEmbed = {
			color: 0x00FFFF,
			title: 'Server',
			description: 'Details of the server',
			fields: [
				{
					name: 'Server name:',
					value: message.guild.name,
				},
				{
					name: 'Total members: ',
					value: message.guild.memberCount,
				},
			],
			timestamp: new Date(),
		};
		message.channel.send({ embed: helpEmbed });
		// message.channel.send(`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`);
	},
};