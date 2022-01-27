import React from 'react';
import {useSelector} from 'react-redux';

import {DEFAULT_OP} from 'types/default';

import Loader from 'components/widgets/loader/Loader';
import Helmet from 'components/widgets/helmet/Helmet';

import ErrorPage from 'ErrorPage';

import Routes from './Routes';

import './App.scss';

function App() {
	const {op} = useSelector(state => state.auth);

	if (op[DEFAULT_OP.loading].loading) return <Loader />;

	return (
		<ErrorPage>
			<Helmet
				title="Taleguild | Gamified Experience for Productive Writing"
				description="Taleguild is the place where writers publish their work, gain inspiration, feedback, and community, and is your best place to discover and connect with writers worldwide."
			/>

			<Routes />
		</ErrorPage>
	);
}

export default App;
