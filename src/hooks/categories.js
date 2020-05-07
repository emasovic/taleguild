import {useState, useEffect} from 'react';

import {getCategories} from 'lib/api';

export const useLoadCategories = () => {
	const [data, setData] = useState([]);
	const [params, setParams] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			setError(false);
			setIsLoading(true);

			try {
				const categories = await getCategories(params);
				setData(categories);
			} catch (error) {
				setError(error);
			}

			setIsLoading(false);
		};

		fetchData();
	}, [params]);

	return [{data, isLoading, error}, setParams];
};
