import React from 'react';
import {useSelector} from 'react-redux';

import {DEFAULT_META_TAGS, DEFAULT_OP} from 'types/default';

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
			<Helmet title={DEFAULT_META_TAGS.title} description={DEFAULT_META_TAGS.description} />

			<Routes />
		</ErrorPage>
	);
}

export default App;
