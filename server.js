const express = require('express');
const path = require('path');
const fs = require('fs');

const env = require('./src/env');

const {User, Story, File} = require('./db');

const getIdFromSlug = slug => {
	const splited = slug.split('-');
	const id = splited[splited.length - 1];

	return id;
};

const PORT = process.env.PORT || 5000;

const DEFAULT_IMAGE_URL = `${env.PUBLIC_URL}/taleguild-share.png`;

const app = express();

app.use(express.static(path.resolve(__dirname, 'build')));

const filePath = path.resolve(__dirname, 'build', 'index.html');

app.get('/story/*', async (req, res) => {
	const filePath = path.resolve(__dirname, 'build', 'index.html');
	const storyId = getIdFromSlug(req.params[0]);

	try {
		let story = await new Story({id: storyId}).fetch();
		let image;

		try {
			image = await new File({related_id: storyId, related_type: 'stories'}).fetch({
				withRelated: ['upload_file_id'],
			});
			image = image.toJSON();

			image =
				image && image.upload_file_id
					? env.API_URL + image.upload_file_id.url
					: DEFAULT_IMAGE_URL;
		} catch (error) {
			image = DEFAULT_IMAGE_URL;
		}

		story = story.toJSON();

		fs.readFile(filePath, 'utf8', (err, data) => {
			if (err) {
				return console.log(err);
			}

			data = data
				.replace(/__TITLE__/g, story.title)
				.replace(/__DESCRIPTION__/g, story.description)
				.replace(/__IMAGE_URL__/g, image);

			res.send(data);
		});
	} catch (error) {
		console.log(error);
		res.sendFile(filePath);
	}
});

app.get('/user/*', async (req, res) => {
	const username = req.params[0];

	try {
		let user = await new User({username}).fetch();
		user = user.toJSON();
		let image;
		try {
			image = await new File({
				related_id: user.id,
				related_type: 'users-permissions_user',
			}).fetch({
				withRelated: ['upload_file_id'],
			});
			image = image.toJSON();

			image =
				image && image.upload_file_id
					? env.API_URL + image.upload_file_id.url
					: DEFAULT_IMAGE_URL;
		} catch (error) {
			image = DEFAULT_IMAGE_URL;
		}

		fs.readFile(filePath, 'utf8', (err, data) => {
			if (err) {
				return console.log(err);
			}

			data = data
				.replace(/__TITLE__/g, user.display_name || user.username)
				.replace(/__DESCRIPTION__/g, user.description || user.username)
				.replace(/__IMAGE_URL__/g, image);

			res.send(data);
		});
	} catch (error) {
		console.log(error);
		res.sendFile(filePath);
	}
});

app.get('/*', function(req, res) {
	fs.readFile(filePath, 'utf8', (err, data) => {
		if (err) {
			return console.log(err);
		}

		data = data
			.replace(
				/__TITLE__/g,
				'Taleguild | Social Network for Short Stories Writers & Essayists'
			)
			.replace(/__DESCRIPTION__/g, 'Social Network of Short Story Writers & Essayists')
			.replace(/__IMAGE_URL__/g, DEFAULT_IMAGE_URL);

		res.send(data);
	});
});

app.listen(PORT, () => {
	console.log(`Server is listening on port ${PORT}`);
});
