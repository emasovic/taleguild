import React from 'react';
import {useSelector} from 'react-redux';

import {DEFAULT_META_TAGS, DEFAULT_OP} from 'types/default';

import {selectAuthUser} from 'redux/auth';

import Loader from 'components/widgets/loader/Loader';
import Helmet from 'components/widgets/helmet/Helmet';

import ErrorPage from 'ErrorPage';

import Routes from 'Routes';
import CookiesPopup from 'CookiesPopup';
import RealTimeUpdates from 'RealTimeUpdates';

import './App.scss';

function App() {
	const {op, data} = useSelector(selectAuthUser);
	const isAccepted = localStorage.getItem('termsAccepted');

	if (op[DEFAULT_OP.loading].loading) return <Loader />;

	return (
		<ErrorPage>
			<Helmet title={DEFAULT_META_TAGS.title} description={DEFAULT_META_TAGS.description} />

			<Routes />
			{data && <RealTimeUpdates />}
			{!isAccepted && <CookiesPopup />}
		</ErrorPage>
	);
}

export default App;
