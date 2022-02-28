import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import ReactGA from 'react-ga4';
import {Route} from 'react-router-dom';

const GA_EVENT = {
	pageview: 'pageview',
};

export class GoogleAnalytics extends PureComponent {
	componentDidMount() {
		this.logPageChange(this.props.location.pathname, this.props.location.search);
	}

	componentDidUpdate({location: prevLocation}) {
		const {
			location: {pathname, search},
		} = this.props;
		const isDifferentPathname = pathname !== prevLocation.pathname;
		const isDifferentSearch = search !== prevLocation.search;

		if (isDifferentPathname || isDifferentSearch) {
			this.logPageChange(pathname, search);
		}
	}

	logPageChange(pathname, search = '') {
		const page = pathname + search;
		const {location} = window;
		ReactGA.set({
			page,
			location: `${location.origin}${page}`,
			...this.props.options,
		});
		ReactGA.send({hitType: GA_EVENT.pageview, page});
	}

	render() {
		return null;
	}
}

GoogleAnalytics.propTypes = {
	location: PropTypes.shape({
		pathname: PropTypes.string,
		search: PropTypes.string,
	}).isRequired,
	options: PropTypes.object,
};

export const RouteTracker = () => <Route component={GoogleAnalytics} />;

export const init = () => {
	const isGAEnabled = !!process.env.REACT_APP_GA_TRACKING_ID;
	if (isGAEnabled) {
		ReactGA.initialize(process.env.REACT_APP_GA_TRACKING_ID);
	}

	return isGAEnabled;
};
