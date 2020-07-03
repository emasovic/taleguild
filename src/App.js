import React from 'react';
import {useSelector} from 'react-redux';

import Routes from './Routes';

import Loader from 'components/widgets/loader/Loader';

import './App.scss';

// const CLASS = 'st-App';

function App() {
	const loading = useSelector(state => state.user.loading);

	if (loading) {
		return <Loader />;
	}

	return <Routes />;
}

export default App;
