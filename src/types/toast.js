import uniqueId from 'lodash.uniqueid';

export const TOAST_TYPES = {
	success: 'success',
	warning: 'warning',
	error: 'error',
	info: 'info',
};

// eslint-disable-next-line
const DEFAULT_OPTIONS = {
	type: TOAST_TYPES.success,
	title: '',
	text: '',
	duration: 3000,
};

const DEFAULT_TOAST_TITLES = {
	success: 'Success',
	warning: 'Warning',
	error: 'Error',
	info: 'Info',
};

const DEFAULT_TOAST_DURATIONS = {
	success: 10 * 1000,
	warning: 10 * 1000,
	error: 10 * 1000, // 0 for Indefinite
	info: 10 * 1000,
};

export class Toast {
	constructor(text, type = TOAST_TYPES.success, title = null, action = null) {
		this.id = uniqueId();
		this.text = text || '';
		this.type = type;
		this.action = action;
		this.title = title || DEFAULT_TOAST_TITLES[type];
		this.duration = DEFAULT_TOAST_DURATIONS[type];
	}
}

Toast.error = (error, title, action) => {
	return new Toast(error.message || error, TOAST_TYPES.error, title, action);
};

Toast.warning = (warning, title, action) => {
	return new Toast(warning.message || warning, TOAST_TYPES.warning, title, action);
};

Toast.info = (info, title, action) => {
	return new Toast(info.message || info, TOAST_TYPES.info, title, action);
};

Toast.success = (success, title, action) => {
	return new Toast(success.message || success, TOAST_TYPES.success, title, action);
};
