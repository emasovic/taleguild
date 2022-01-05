import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import {THEMES} from 'types/themes';

import store from 'redux/store';
import {getUser} from 'redux/auth';

import * as serviceWorker from './serviceWorker';

import App from 'App';
import NewVersionAvailable from 'NewVersionAvailable';
import Toasts from 'Toasts';
import RealTimeUpdates from 'RealTimeUpdates';

import 'types/font_awesome';

import 'styles/index.scss';

const theme = localStorage.getItem('theme') || THEMES.dark;
document.documentElement.classList.add(`theme-${theme}`);

store.dispatch(getUser());
ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<App />
			<Toasts />
			<RealTimeUpdates />
			<NewVersionAvailable />
		</Provider>
	</React.StrictMode>,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
