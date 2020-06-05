export const hepler = arr =>
	arr &&
	arr.reduce((map, obj) => {
		map[obj.id] = obj;
		return map;
	}, {});

export const gotDataHelper = (state, data) => {
	if (!Array.isArray(data)) {
		data = [data];
	}

	data = hepler(data);

	if (!state) {
		return {
			...data,
		};
	}

	return {
		...state,
		...data,
	};
};
