import React from 'react';
import {Helmet as Rhelmet} from 'react-helmet';
import PropTypes from 'prop-types';

export default function Helmet({title, description}) {
	return (
		<Rhelmet title={title}>
			<title>{title}</title>
			<meta name="title" content={title} />
			<meta name="description" content={description} />

			<meta property="og:title" content={title} />
			<meta property="og:description" content={description} />

			<meta name="twitter:title" content={title} />
			<meta name="twitter:description" content={description} />
		</Rhelmet>
	);
}

Helmet.propTypes = {
	title: PropTypes.string,
	description: PropTypes.string,
};
