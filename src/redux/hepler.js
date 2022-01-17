import {DEFAULT_OP} from 'types/default';

export const hepler = arr => {
	const obj = {};

	arr.forEach(item => {
		obj[item.id] = item;
	});

	return obj;
};

export const gotDataHelper = (state, data, invalidate, key) => {
	if (!data) {
		return null;
	}

	if (!state) {
		state = {};
	}

	if (!Array.isArray(data)) {
		data = [data];
	}

	data = hepler(data);

	if (invalidate) {
		return {...data};
	}

	if (key) {
		return {
			...state,
			[key]: {...state[key], ...data},
		};
	}

	return {
		...state,
		...data,
	};
};

export const createOperations = (ops = []) => {
	const allOps = [...Object.keys(DEFAULT_OP), ...ops];
	return allOps.reduce(
		(acc, val) => ({
			...acc,
			[val]: {loading: false, success: false, error: false},
		}),
		{}
	);
};

export const startOperation = () => ({loading: true, success: false, error: false});
export const endOperation = err => {
	if (err) return {loading: false, success: false, error: err};
	return {loading: false, success: true, error: null};
};

// SELECTORS

export const selectProps = (_, props) => props;
