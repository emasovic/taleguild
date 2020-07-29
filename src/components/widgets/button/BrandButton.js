import React from 'react';

import ENV from 'env';

import FA from 'types/font_awesome';
import {BRAND} from 'types/button';

import IconButton from './IconButton';

const BRAND_ICONS = {
	[BRAND.facebook]: FA.brand_facebook_f,
	[BRAND.google]: FA.brand_google,
};

export default function BrandButton({brand, ...rest}) {
	const url = `${ENV.api.url}/connect/${brand}`;

	return <IconButton {...rest} icon={BRAND_ICONS[brand]} href={url} />;
}
