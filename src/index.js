import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import {THEMES} from 'types/themes';

import store from './redux/store';
import {initialize} from 'redux/application';

import * as serviceWorker from './serviceWorker';

import Notifications from 'components/notifications/Notifications';

import App from './App';
import Toasts from './Toasts';

import 'types/font_awesome';

import 'styles/index.scss';

const theme = localStorage.getItem('theme') || THEMES.dark;
document.documentElement.classList.add(`theme-${theme}`);

store.dispatch(initialize());

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<App />
			<Toasts />
			<Notifications />
		</Provider>
	</React.StrictMode>,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
