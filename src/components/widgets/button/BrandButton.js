import React from 'react';
import PropTypes from 'prop-types';

import FA from 'types/font_awesome';
import {BRAND} from 'types/button';

import IconButton from './IconButton';

const BRAND_ICONS = {
	[BRAND.facebook]: FA.brand_facebook_f,
	[BRAND.google]: FA.brand_google,
};

export default function BrandButton({brand, ...rest}) {
	const url = `${process.env.REACT_APP_API_URL}/connect/${brand}`;

	return <IconButton {...rest} icon={BRAND_ICONS[brand]} href={url} />;
}

BrandButton.propTypes = {
	brand: PropTypes.string,
};
