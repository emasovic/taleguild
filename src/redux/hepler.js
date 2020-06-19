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
