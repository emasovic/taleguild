import React from 'react';
import {hydrate, render} from 'react-dom';
import {Provider} from 'react-redux';

import store from './redux/store';
import {getUser} from 'redux/user';

import * as serviceWorker from './serviceWorker';

import App from './App';
import Toasts from './Toasts';

import 'types/font_awesome';

import './index.scss';

store.dispatch(getUser());

const rootElement = document.getElementById('root');

if (rootElement.hasChildNodes()) {
	hydrate(
		<React.StrictMode>
			<Provider store={store}>
				<App />
				<Toasts />
			</Provider>
		</React.StrictMode>,
		rootElement
	);
} else {
	render(
		<React.StrictMode>
			<Provider store={store}>
				<App />
				<Toasts />
			</Provider>
		</React.StrictMode>,
		rootElement
	);
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
