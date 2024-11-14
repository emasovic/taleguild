import {ReactComponent as LogoGrey} from 'images/taleguild-logo-grey.svg';
import {ReactComponent as Logo} from 'images/taleguild-logo.svg';
import {ReactComponent as Coin} from 'images/coin.svg';
import {ReactComponent as Star} from 'images/star.svg';
import {ReactComponent as Clock} from 'images/clock.svg';
import {ReactComponent as Moon} from 'images/moon.svg';
import {ReactComponent as Sun} from 'images/sun.svg';

export const ICONS = {
	logo: 'logo',
	logo_grey: 'logo_grey',
	coin: 'coin',
	star: 'star',
	clock: 'clock',
	moon: 'moon',
	sun: 'sun',
};

export const ICON_COMPONENTS = {
	[ICONS.logo]: Logo,
	[ICONS.logo_grey]: LogoGrey,
	[ICONS.coin]: Coin,
	[ICONS.star]: Star,
	[ICONS.clock]: Clock,
	[ICONS.moon]: Moon,
	[ICONS.sun]: Sun,
};

export const ICON_TYPES = {
	fa: 'fa',
	local: 'local',
};
