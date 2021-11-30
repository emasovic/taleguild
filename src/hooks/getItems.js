import {useState, useEffect} from 'react';

export const useLoadItems = (loadFunction, defaultParams) => {
	const [data, setData] = useState([]);
	const [params, setParams] = useState(defaultParams);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			setError(false);
			setIsLoading(true);

			try {
				const stories = await loadFunction(params);
				setData(stories);
			} catch (error) {
				setError(error);
			}

			setIsLoading(false);
		};

		fetchData();
	}, [params, loadFunction]);

	return [{data, isLoading, error}, setParams];
};
