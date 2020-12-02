module.exports = {
	name: 'weather',
	description: 'Get weather information by your zip code and country code.',
	usage: '[zipcode countrycode]',
	execute(message, args) {
		if (!args.length) {
			return message.reply('Please provide a zipcode to search for.');
		}
		message.channel.startTyping();
		const messageToDelete = message.channel.send('Processing your request...');
		sendWeatherEmbed(message, args, messageToDelete);
	},
};

const { openWeatherMapApiToken } = require('../config.json');
const https = require('https');

function sendWeatherEmbed(message, args, messageToDelete) {
	const zipCode = args[0];
	let weather;
	const countryCode = ',' + (args[1] || 'IN');
	const url = `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode}${countryCode}&appid=${openWeatherMapApiToken}&units=metric`;
	// console.log(url);
	https.get(url, (response) => {
		response.on('data', (data) => {
			weather = JSON.parse(data);
			message.channel.stopTyping();
			messageToDelete.then((msg) => msg.delete({ timeout: 1 }));
			if (weather.cod == '404') {
				return message.reply(
					'Please make sure you have provided the right zipcode and country code.',
				);
			}
			const weatherEmbed = makeEmbed(weather);
			message.channel.send({ embed: weatherEmbed });
		});
		response.on('error', () => {
			return message.reply(
				'Please make sure you have provided the right zipcode and country code.',
			);
		});
	});
}

function makeEmbed(weather) {
	const weatherEmbed = {
		color: 0x00ffff,
		title: `Weather report of ${weather.name}`,
		description: weather.weather[0].description,
		thumbnail: {
			url: `http://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`,
		},
		fields: [
			{
				name: 'Current Temp: ',
				value: weather.main.temp + '°C',
				inline: true,
			},
			{
				name: 'Feels Like: ',
				value: weather.main.feels_like + '°C',
				inline: true,
			},
			{
				name: 'Temp Min: ',
				value: weather.main.temp_min + '°C',
				inline: true,
			},
			{
				name: 'Temp Max: ',
				value: weather.main.temp_max + '°C',
				inline: true,
			},
			{
				name: 'Pressure: ',
				value: weather.main.pressure,
				inline: true,
			},
			{
				name: 'Humidity: ',
				value: weather.main.humidity + '%',
				inline: true,
			},
			{
				name: 'Visibility: ',
				value: weather.visibility + 'm',
				inline: true,
			},
			{
				name: 'Wind Speed: ',
				value: weather.wind.speed + 'm/s',
				inline: true,
			},
		],
		timestamp: new Date(),
	};

	return weatherEmbed;
}
