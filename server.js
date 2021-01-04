const express = require('express');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

const getIdFromSlug = slug => {
	const splited = slug.split('-');
	const id = splited[splited.length - 1];

	return id;
};

const api = 'http://dcoders.rs:1330';

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.static(path.resolve(__dirname, 'build')));

const filePath = path.resolve(__dirname, 'build', 'index.html');

app.get('/story/*', (req, res) => {
	const filePath = path.resolve(__dirname, 'build', 'index.html');
	const storyId = getIdFromSlug(req.params[0]);

	axios
		.get(`${api}/stories/${storyId}`, {proxy: {host: '147.135.167.132', port: 1330}})
		.then(response => {
			const {data: rData} = response;
			fs.readFile(filePath, 'utf8', (err, data) => {
				if (err) {
					return console.log(err);
				}

				data = data
					.replace(/__TITLE__/g, rData.title)
					.replace(/__DESCRIPTION__/g, rData.description);
				if (rData && rData.image) {
					data = data.replace(/__IMAGE_URL__/g, api + rData.image.url);
				}

				res.send(data);
			});
		})
		.catch(err => {
			console.log(err);
			res.sendFile(filePath);
		});
});

app.get('/user/*', (req, res) => {
	const username = req.params[0];

	axios
		.get(`${api}/users/username/${username}`, {proxy: {host: '147.135.167.132', port: 1330}})
		.then(response => {
			const {data: rData} = response;
			fs.readFile(filePath, 'utf8', (err, data) => {
				if (err) {
					return console.log(err);
				}

				data = data
					.replace(/__TITLE__/g, rData.display_name || rData.username)
					.replace(/__DESCRIPTION__/g, rData.description || rData.username);
				if (rData && rData.avatar) {
					data = data.replace(/__IMAGE_URL__/g, api + rData.avatar.url);
				}

				res.send(data);
			});
		})
		.catch(err => {
			console.log(err);
			res.sendFile(filePath);
		});
});

app.get('/*', function(req, res) {
	res.sendFile(filePath);
});

app.listen(PORT, () => {
	console.log(`Server is listening on port ${PORT}`);
});
