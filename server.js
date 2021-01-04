const express = require('express');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

const getIdFromSlug = slug => {
	const splited = slug.split('-');
	const id = splited[splited.length - 1];

	return id;
};

const api = 'http://localhost:1337';

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.static(path.resolve(__dirname, 'build')));

app.get('/story/*', (req, res) => {
	const filePath = path.resolve(__dirname, 'build', 'index.html');
	const storyId = getIdFromSlug(req.params[0]);

	axios
		.get(`${api}/stories/${storyId}`)
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
					data = data.concat(`<meta property="og:image" content="${api +
						rData.image.url}" />
					<meta property="twitter:image" content="${api + rData.image.url}" />`);
				}

				res.send(data);
			});
		})
		.catch(err => console.log(err));
});

app.get('/*', function(req, res) {
	res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
	console.log(`Server is listening on port ${PORT}`);
});
