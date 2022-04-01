import {Node} from 'slate';

export const detectIE = () => {
	let ua = window.navigator.userAgent;
	let msie = ua.indexOf('MSIE ');
	if (msie > 0) {
		// IE 10 or older => return version number
		return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
	}
	let trident = ua.indexOf('Trident/');
	if (trident > 0) {
		// IE 11 => return version number
		let rv = ua.indexOf('rv:');
		return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
	}
	let edge = ua.indexOf('Edge/');
	if (edge > 0) {
		// Edge (IE 12+) => return version number
		return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
	}
	// other browser
	return false;
};

export const emailRegExp = new RegExp(
	/^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\\,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
);

export const getImageUrl = url => url && process.env.REACT_APP_API_URL + url;

export const kFormatter = num =>
	Math.abs(num) > 999
		? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + 'k'
		: Math.sign(num) * Math.abs(num);

export const ordinalSuffixOf = i => {
	let j = i % 10,
		k = i % 100;
	if (j === 1 && k !== 11) {
		return i + 'st';
	}
	if (j === 2 && k !== 12) {
		return i + 'nd';
	}
	if (j === 3 && k !== 13) {
		return i + 'rd';
	}
	return i + 'th';
};

export const setTimeToDate = (hours, minutes, seconds) => {
	const today = new Date();
	return new Date(
		today.getFullYear(),
		today.getMonth(),
		today.getDate(),
		hours,
		minutes,
		seconds
	).toISOString();
};

export const secondsToHoursMinutes = seconds =>
	new Date(seconds * 1000).toISOString().substr(11, 5);

export const serializeTextEditorValue = (nodes, sliceAt) => {
	let text = nodes.map(n => Node.string(n)).join('\n');
	text = sliceAt ? (text.length > sliceAt ? `${text.slice(0, sliceAt)}...` : text) : text;
	return text;
};

export const isDesktop = window.screen.width > 1166;
export const isMobile = window.screen.width < 768;

export const capitalize = string => {
	return string.charAt(0).toUpperCase() + string.slice(1);
};

export const isElementInViewport = el => {
	if (!el) {
		return false;
	}

	const rect = el.getBoundingClientRect();

	return (
		rect.top >= 0 &&
		rect.left >= 0 &&
		rect.bottom <=
			(window.innerHeight ||
				document.documentElement.clientHeight) /*or $(window).height() */ &&
		rect.right <=
			(window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
	);
};
