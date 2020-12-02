module.exports = {
	name: 'weather',
	description: 'Get weather information by your zip code and country code.',
	usage: '[zipcode countrycode]',
	async execute(message, args) {
		if (!args.length) {
			return message.reply('Please provide a zipcode to search for.');
		}
		message.channel.startTyping();
		const messageToDelete = message.channel.send('Processing your request...');
		const weather = await getWeather(args);
		messageToDelete.then(msg => msg.delete({ timeout: 1 }));
		message.channel.stopTyping();
		if (weather == -1) {
			return message.reply('Please make sure you have provided the right zipcode and country code.');
		}
		return message.channel.send({ embed: makeWeatherEmbed(weather) });
	},
};

const { openWeatherMapApiToken } = require('../config.json');
const fetch = require('node-fetch');
const querystring = require('querystring');

async function getWeather(args) {
	const zipCode = args[0] + ',' + (args[1] || 'IN');
	const query = querystring.stringify({ zip: zipCode, appid: openWeatherMapApiToken, units: 'metric' });
	const url = `https://api.openweathermap.org/data/2.5/weather?${query}`;
	const weather = await fetch(url).then(response => response.json());
	// console.log('URL: ' + url);
	// console.log('Weather.name: ' + weather.name);
	if (weather.cod == '404') {
		return -1;
	}
	return weather;
}

function makeWeatherEmbed(weather) {
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
