import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import {THEMES} from 'types/themes';
import {Toast} from 'types/toast';

import store from 'redux/store';
import {getUser} from 'redux/auth';
import {newToast} from 'redux/toast';

import * as serviceWorker from './serviceWorker';

import App from 'App';
import Toasts from 'Toasts';
import RealTimeUpdates from 'RealTimeUpdates';

import 'types/font_awesome';

import 'styles/index.scss';

const theme = localStorage.getItem('theme') || THEMES.light;
document.documentElement.classList.add(`theme-${theme}`);

store.dispatch(getUser());
ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<App />
			<Toasts />
			<RealTimeUpdates />
		</Provider>
	</React.StrictMode>,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
const updateAction = registration => {
	registration?.waiting?.postMessage({type: 'SKIP_WAITING'});
	setTimeout(() => window.location.reload(true), 5000);
};

const onUpdate = registration => {
	store.dispatch(
		newToast({
			...Toast.info(
				`New version is available and the app will reload in the next few moments. Don't worry, your work will be saved.`,
				'New version',
				() => updateAction(registration)
			),
		})
	);
};
serviceWorker.register({onUpdate});
