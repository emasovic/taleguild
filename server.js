const express = require('express');
const path = require('path');
const fs = require('fs');

const {renderToString} = require('react-dom/server');
const React = require('react');
const {Helmet} = require('react-helmet');
const {StaticRouter} = require('react-router-dom');

const PORT = process.env.PORT || 5000;

const app = express();

const filePath = path.resolve(__dirname, 'build', 'index.html');

app.use(express.static(path.resolve(__dirname, 'build')));

app.get('/*', function(req, res) {
	fs.readFile(filePath, 'utf8', (err, data) => {
		if (err) {
			return console.log(err);
		}

		let context = {};
		let html = renderToString(
			React.createElement(StaticRouter, {
				location: req.url,
				context: context,
			})
		);
		const helmet = Helmet.renderStatic();

		data = data
			.replace('<div id="root"></div>', `<div id="root">${html}</div>`)
			.replace('</head>', `${helmet.title.toString()}</head>`)
			.replace('</head>', `${helmet.meta.toString()}</head>`)
			.replace('</head>', `${helmet.link.toString()}</head>`);

		res.send(data);
	});
});

app.listen(PORT, () => {
	console.log(`Server is listening on port ${PORT}`);
});
