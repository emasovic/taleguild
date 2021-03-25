import React from 'react';
import {Helmet as Rhelmet} from 'react-helmet';

export default function Helmet({title, description, imageUrl, image}) {
	if (image) {
		imageUrl = process.env.REACT_APP_API_URL + image.url;
	}
	return (
		<Rhelmet title={title}>
			<title>{title}</title>
			<meta name="title" content={title} />
			<meta name="description" content={description} />

			<meta property="og:title" content={title} />
			<meta property="og:description" content={description} />
			<meta property="og:image" content={imageUrl} />
			<meta property="og:image:alt" content="Preview image" />
			<meta property="og:image:width" content="1280" />
			<meta property="og:image:height" content="720" />

			<meta name="twitter:title" content={title} />
			<meta name="twitter:description" content={description} />
			<meta name="twitter:image" content={imageUrl} />
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:image:alt" content="Preview image" />

			<link rel="apple-touch-icon" href={imageUrl} />
		</Rhelmet>
	);
}
