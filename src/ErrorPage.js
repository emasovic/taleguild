import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {TYPOGRAPHY_MERRI, TYPOGRAPHY_LATO} from 'types/typography';

import IconButton from 'components/widgets/button/IconButton';

import {ReactComponent as LogoShiled} from 'images/logo-shield.svg';

import './ErrorPage.scss';

const CLASS = 'st-ErrorPage';

export default class ErrorPage extends Component {
	state = {
		err: null,
	};
	componentDidCatch(err) {
		this.setState({err: err.toString()});
	}
	render() {
		const {err} = this.state;
		if (err) {
			return (
				<div className={CLASS}>
					<LogoShiled />

					<span className={TYPOGRAPHY_MERRI.heading_h1_black_bold}>
						Oops, Something Went Wrong.
					</span>
					<span className={TYPOGRAPHY_LATO.placeholder_grey_medium}>
						Try reloading you page or press reload button.
					</span>

					<IconButton onClick={() => window.location.reload()}>Reload</IconButton>
				</div>
			);
		}
		return this.props.children;
	}
}

ErrorPage.propTypes = {
	children: PropTypes.any,
};
