import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useFormik} from 'formik';

import {FORGOT_PASSWORD, REGISTER} from 'lib/routes';

import {COLOR, BRAND} from 'types/button';
import {FONTS, FONT_WEIGHT, TYPOGRAPHY_VARIANTS} from 'types/typography';
import {DEFAULT_OP} from 'types/default';
import {USER_OP} from 'types/user';

import {loginUser, selectAuthUser} from '../../redux/auth';

import Link, {UNDERLINE} from 'components/widgets/link/Link';
import FloatingInput from 'components/widgets/input/FloatingInput';
import IconButton from 'components/widgets/button/IconButton';
import BrandButton from 'components/widgets/button/BrandButton';
import Typography from 'components/widgets/typography/Typography';

import './Login.scss';

const CLASS = 'st-Login';

export default function Login() {
	const dispatch = useDispatch();
	const {op} = useSelector(selectAuthUser);

	const handleSubmit = ({identifier, password}) => {
		dispatch(loginUser({identifier, password}));
		resetForm();
	};

	const {values, dirty, handleSubmit: formikSubmit, resetForm, handleChange} = useFormik({
		validateOnChange: false,
		initialValues: {
			identifier: '',
			password: '',
		},
		onSubmit: handleSubmit,
	});

	return (
		<form onSubmit={formikSubmit} className={CLASS}>
			<Typography
				variant={TYPOGRAPHY_VARIANTS.h4}
				component={TYPOGRAPHY_VARIANTS.h4}
				fontWeight={FONT_WEIGHT.bold}
				font={FONTS.merri}
			>
				Welcome Back
			</Typography>
			<FloatingInput
				label="Email or username"
				name="identifier"
				value={values.identifier}
				type="text"
				onChange={handleChange}
				wholeEvent
			/>

			<FloatingInput
				label="Password"
				name="password"
				value={values.password}
				autoComplete="on"
				type="password"
				onChange={handleChange}
				wholeEvent
			/>

			<Link to={FORGOT_PASSWORD} underline={UNDERLINE.hover}>
				Forgot password?
			</Link>

			<IconButton loading={op[USER_OP.login].loading} disabled={!dirty} type="submit">
				Sign in
			</IconButton>

			<Typography className={CLASS + '-divider'}>OR</Typography>

			<BrandButton
				loading={op[DEFAULT_OP.loading].loading || op[DEFAULT_OP.load_more].loading}
				color={COLOR.secondary}
				brand={BRAND.google}
			>
				Sign in with Google
			</BrandButton>

			<BrandButton
				loading={op[DEFAULT_OP.loading].loading || op[DEFAULT_OP.load_more].loading}
				color={COLOR.secondary}
				brand={BRAND.facebook}
			>
				Sign in with Facebook
			</BrandButton>

			<Link to={REGISTER} underline={UNDERLINE.hover}>
				Don’t have an account? Sign up now.
			</Link>
		</form>
	);
}
