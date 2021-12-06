import {useState, useEffect} from 'react';

export const useLoadItems = (loadFunction, defaultParams) => {
	const [data, setData] = useState([]);
	const [params, setParams] = useState(defaultParams);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		let unmounted = false;
		const fetchData = async () => {
			setError('');
			setIsLoading(true);

			try {
				const res = await loadFunction(params);
				if (res.error) {
					!unmounted && setError(res.error);
				} else {
					!unmounted && setData(res);
				}
			} catch (error) {
				!unmounted && setError(error);
			}

			!unmounted && setIsLoading(false);
		};

		fetchData();

		return () => {
			unmounted = true;
		};
	}, [params, loadFunction]);

	return [{data, isLoading, error}, setParams];
};
