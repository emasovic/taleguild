import React from 'react';
import {Helmet as Rhelmet} from 'react-helmet';

export default function Helmet({title, description}) {
	return (
		<Rhelmet title={title}>
			<meta name="title" content={title} />
			<meta name="description" content={description} />

			<meta property="og:title" content={title} />
			<meta property="og:description" content={description} />

			<meta name="twitter:title" content={title} />
			<meta name="twitter:description" content={description} />
		</Rhelmet>
	);
}
