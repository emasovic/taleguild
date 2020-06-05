import {useState, useEffect} from 'react';

import {getStories} from 'lib/api';

export const useLoadStories = () => {
	const [data, setData] = useState([]);
	const [params, setParams] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			setError(false);
			setIsLoading(true);

			try {
				const stories = await getStories(params);
				setData(stories);
			} catch (error) {
				setError(error);
			}

			setIsLoading(false);
		};

		fetchData();
	}, [params]);

	return [{data, isLoading, error}, setParams];
};
