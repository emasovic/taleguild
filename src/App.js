import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';

import {getUser} from './redux/user';

import Routes from './Routes';

function App() {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getUser());
	}, [dispatch]);

	return <Routes />;
}

export default App;
