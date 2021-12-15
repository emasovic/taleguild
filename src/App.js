import React from 'react';
import {useSelector} from 'react-redux';

import Routes from './Routes';

import Loader from 'components/widgets/loader/Loader';
import Helmet from 'components/widgets/helmet/Helmet';

import ErrorPage from 'ErrorPage';

import './App.scss';

// const CLASS = 'st-App';

function App() {
	const loading = useSelector(state => state.application.auth);

	if (loading) {
		return <Loader />;
	}

	return (
		<ErrorPage>
			<Helmet
				title="Taleguild | Discover the Place with Top Writers"
				description="Taleguild is the place where writers publish their work, gain inspiration, feedback, and community, and is your best place to discover and connect with writers worldwide."
			/>
			<Routes />
		</ErrorPage>
	);
}

export default App;
