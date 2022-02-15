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

const DEFAULT_STORY_IMAGE_URL = `${env.PUBLIC_URL}/default-story-share.png`;
const DEFAULT_IMAGE_URL = `${env.PUBLIC_URL}/referral-share.png`;

const app = express();

const filePath = path.resolve(__dirname, 'build', 'index.html');

app.get('/story/:slug', async (req, res) => {
	const filePath = path.resolve(__dirname, 'build', 'index.html');

	const storyId = getIdFromSlug(req.params.slug);
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
					: DEFAULT_STORY_IMAGE_URL;
		} catch (error) {
			image = DEFAULT_STORY_IMAGE_URL;
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

app.get('/user/:username', async (req, res) => {
	const username = req.params.username;

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

app.get('/register', async (req, res) => {
	const username = req.query.referral;

	if (!username) {
		fs.readFile(filePath, 'utf8', (err, data) => {
			if (err) {
				return console.log(err);
			}

			data = data
				.replace(/__TITLE__/g, 'Taleguild | Gamified Experience for Productive Writing')
				.replace(
					/__DESCRIPTION__/g,
					'Taleguild is the place where writers publish their work, gain inspiration, feedback, and community, and is your best place to discover and connect with writers worldwide.'
				)
				.replace(/__IMAGE_URL__/g, DEFAULT_IMAGE_URL);

			res.send(data);
		});
	}

	try {
		let user = await new User({username}).fetch();
		user = user.toJSON();

		fs.readFile(filePath, 'utf8', (err, data) => {
			if (err) {
				return console.log(err);
			}

			const name = user.display_name || user.username;

			data = data
				.replace(/__TITLE__/g, 'Join Taleguild and build your writing habits')
				.replace(/__DESCRIPTION__/g, `${name} invited you to join our guild`)
				.replace(/__IMAGE_URL__/g, DEFAULT_IMAGE_URL);

			res.send(data);
		});
	} catch (error) {
		console.log(error);
		res.sendFile(filePath);
	}
});

app.get('/', function(req, res) {
	fs.readFile(filePath, 'utf8', (err, data) => {
		if (err) {
			return console.log(err);
		}

		data = data
			.replace(/__TITLE__/g, 'Taleguild | Gamified Experience for Productive Writing')
			.replace(
				/__DESCRIPTION__/g,
				'Taleguild is the place where writers publish their work, gain inspiration, feedback, and community, and is your best place to discover and connect with writers worldwide.'
			)
			.replace(/__IMAGE_URL__/g, DEFAULT_IMAGE_URL);

		res.send(data);
	});
});

app.use(express.static(path.resolve(__dirname, 'build')));

app.get('/*', function(req, res) {
	fs.readFile(filePath, 'utf8', (err, data) => {
		if (err) {
			return console.log(err);
		}

		data = data
			.replace(/__TITLE__/g, 'Taleguild | Gamified Experience for Productive Writing')
			.replace(
				/__DESCRIPTION__/g,
				'Taleguild is the place where writers publish their work, gain inspiration, feedback, and community, and is your best place to discover and connect with writers worldwide.'
			)
			.replace(/__IMAGE_URL__/g, DEFAULT_IMAGE_URL);

		res.send(data);
	});
});

app.listen(PORT, () => {
	console.log(`Server is listening on port ${PORT}`);
});
