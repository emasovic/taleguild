import React from 'react';
import {useSelector} from 'react-redux';

import Routes from './Routes';

import ErrorPage from 'ErrorPage';
import Loader from 'components/widgets/loader/Loader';

import './App.scss';

// const CLASS = 'st-App';

function App() {
	const loading = useSelector(state => state.application.loading);

	if (loading) {
		return <Loader />;
	}

	return (
		<ErrorPage>
			<Routes />
		</ErrorPage>
	);
}

export default App;
