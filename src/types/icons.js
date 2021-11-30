import {ReactComponent as LogoGrey} from 'images/taleguild-logo-grey.svg';
import {ReactComponent as Logo} from 'images/taleguild-logo.svg';
import {ReactComponent as Coin} from 'images/coin.svg';
import {ReactComponent as Star} from 'images/star.svg';
import {ReactComponent as Clock} from 'images/clock.svg';

export const ICONS = {
	logo: 'logo',
	logo_grey: 'logo_grey',
	coin: 'coin',
	star: 'star',
	clock: 'clock',
};

export const ICON_COMPONENTS = {
	[ICONS.logo]: Logo,
	[ICONS.logo_grey]: LogoGrey,
	[ICONS.coin]: Coin,
	[ICONS.star]: Star,
	[ICONS.clock]: Clock,
};
