import GoogleAnalyticsGtag, {trackPageView} from '@redux-beacon/google-analytics-gtag';
import {LOCATION_CHANGE} from 'connected-react-router';
import {createMiddleware} from 'redux-beacon';

const trackingId = process.env.REACT_APP_GA_MEASUREMENT_ID || '';
const ga = GoogleAnalyticsGtag(trackingId);

const getUserFields = state => {
	const fields = {};
	const {data} = state.auth;
	if (data) {
		fields.userId = data.id;
		fields.username = data.username;
	}
	return fields;
};

const eventsMap = {
	[LOCATION_CHANGE]: trackPageView(({payload: {location}}, _, nextState) => ({
		fieldsObject: getUserFields(nextState),
	})),
};

export const gaMiddleware = createMiddleware(eventsMap, ga);
