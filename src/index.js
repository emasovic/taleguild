import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import ReactGA from 'react-ga';

import ENV from 'env';

import 'types/font_awesome';

import store from './redux/store';
import {getUser} from 'redux/user';

import * as serviceWorker from './serviceWorker';

import App from './App';
import Toasts from './Toasts';

import './index.scss';

store.dispatch(getUser());

ReactGA.initialize(ENV.ui.trackingId);

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<App />
			<Toasts />
		</Provider>
	</React.StrictMode>,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
