import React from 'react';
import {useSelector} from 'react-redux';

import Routes from './Routes';

import Loader from 'components/widgets/loader/Loader';

import './App.scss';

// const CLASS = 'st-App';

function App() {
	const initialized = useSelector(state => state.application.initialized);

	if (!initialized) {
		return <Loader />;
	}

	return <Routes />;
}

export default App;
