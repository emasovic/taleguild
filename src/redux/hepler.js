export const hepler = arr => {
	const obj = {};

	arr.forEach(item => {
		obj[item.id] = item;
	});

	return obj;
};

export const gotDataHelper = (state, data) => {
	if (!Array.isArray(data)) {
		data = [data];
	}

	data = hepler(data);

	if (!state) {
		return {...data};
	}

	return {
		...state,
		...data,
	};
};
