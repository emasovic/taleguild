import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {FONTS, TYPOGRAPHY_VARIANTS} from 'types/typography';

import IconButton from 'components/widgets/button/IconButton';
import Typography from 'components/widgets/typography/Typography';

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

					<Typography font={FONTS.merri} variant={TYPOGRAPHY_VARIANTS.h1}>
						Oops, Something Went Wrong.
					</Typography>
					<Typography font={FONTS.lato} variant={TYPOGRAPHY_VARIANTS.p14}>
						Try reloading you page or press reload button.
					</Typography>

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
