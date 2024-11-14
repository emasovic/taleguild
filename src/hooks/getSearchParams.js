import {useLocation} from 'react-router-dom';

export function useGetSearchParams() {
	const urlParams = new URLSearchParams(useLocation().search);
	const params = {};

	for (const [key, value] of urlParams) {
		params[key] = value;
	}

	return params;
}
