import React from 'react';
import {useSelector} from 'react-redux';

import Routes from './Routes';

import Loader from 'components/widgets/loader/Loader';
import Helmet from 'components/widgets/helmet/Helmet';

import ErrorPage from 'ErrorPage';

import './App.scss';
import IconButton from 'components/widgets/button/IconButton';

// const CLASS = 'st-App';

function App() {
	const {loading} = useSelector(state => state.auth);
	const {serviceWorkerInitialized, serviceWorkerRegistration, serviceWorkerUpdated} = useSelector(
		state => state.application
	);

	const updateServiceWorker = () => {
		const registrationWaiting = serviceWorkerRegistration.waiting;
		if (registrationWaiting) {
			registrationWaiting.postMessage({type: 'SKIP_WAITING'});
			registrationWaiting.addEventListener('statechange', e => {
				if (e.target.state === 'activated') {
					window.location.reload();
				}
			});
		}
	};

	console.log('>>>>>>>>>>>>>>>>serviceWorkerRegistration', serviceWorkerRegistration);
	console.log('>>>>>>>>>>>>serviceWorkerUpdateds', serviceWorkerUpdated);
	console.log('>>>>>>>>>serviceWorkerInitialized', serviceWorkerInitialized);

	if (loading) {
		return <Loader />;
	}

	return (
		<ErrorPage>
			<Helmet
				title="Taleguild | Discover the Place with Top Writers"
				description="Taleguild is the place where writers publish their work, gain inspiration, feedback, and community, and is your best place to discover and connect with writers worldwide."
			/>

			{serviceWorkerUpdated && (
				<IconButton onClick={updateServiceWorker}> New version detected </IconButton>
			)}

			<Routes />
		</ErrorPage>
	);
}

export default App;
