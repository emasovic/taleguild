import React from 'react';

import {useDispatch, useSelector} from 'react-redux';
import {Link} from 'react-router-dom';
import {boolean, object, string} from 'yup';
import {useFormik} from 'formik';

import {LOGIN, PRIVACY_POLICY, TERMS_OF_SERVICE} from 'lib/routes';

import {FONTS, FONT_WEIGHT, TYPOGRAPHY_VARIANTS} from 'types/typography';
import {passwordRegex, usernameRegex} from 'types/regex';
import {COLOR, BRAND} from 'types/button';
import {USER_OP} from 'types/user';
import {DEFAULT_OP} from 'types/default';

import {registerUser} from 'redux/auth';

import {useGetSearchParams} from 'hooks/getSearchParams';

import FloatingInput from 'components/widgets/input/FloatingInput';
import IconButton from 'components/widgets/button/IconButton';
import BrandButton from 'components/widgets/button/BrandButton';
import Checkbox from 'components/widgets/checkbox/Checkbox';
import Typography from 'components/widgets/typography/Typography';

import './SignUp.scss';

const CLASS = 'st-SignUp';

const validationSchema = object().shape({
	username: string()
		.min(2, 'Too Short!')
		.max(50, 'Too Long!')
		.matches(usernameRegex.regex, usernameRegex.message)
		.required('Required'),
	password: string()
		.required('Please Enter your password')
		.matches(passwordRegex.regex, passwordRegex.message),
	email: string()
		.required('Required')
		.email('Must be a valid email'),
	terms: boolean().oneOf([true], `You didn't accepted terms and conditions`),
});

export default function SignUp() {
	const dispatch = useDispatch();
	const {op} = useSelector(state => state.auth);
	const {referral} = useGetSearchParams();

	const handleSubmit = ({username, email, password}) => {
		dispatch(registerUser({username: username.toLowerCase(), email, password, referral}));
	};

	const {
		values,
		dirty,
		handleSubmit: formikSubmit,
		errors,
		setFieldValue,
		handleChange,
	} = useFormik({
		validationSchema,
		validateOnChange: false,
		initialValues: {
			username: '',
			password: '',
			email: '',
			terms: false,
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
				Join our guild of writers and storytellers
			</Typography>
			<FloatingInput
				label="Username"
				name="username"
				value={values.username}
				onChange={handleChange}
				invalid={!!errors.username}
				errorMessage={errors.username}
				wholeEvent
			/>

			<FloatingInput
				label="Email Address "
				value={values.email}
				name="email"
				type="email"
				onChange={handleChange}
				invalid={!!errors.email}
				errorMessage={errors.email}
				wholeEvent
			/>

			<FloatingInput
				label="Password"
				name="password"
				value={values.password}
				type="password"
				autoComplete="on"
				onChange={handleChange}
				invalid={!!errors.password}
				errorMessage={errors.password}
				wholeEvent
			/>

			<Checkbox
				label="I agree to Terms of Service and Privacy Policy"
				name="terms"
				checked={values.terms}
				onChange={val => setFieldValue('terms', val)}
				invalid={!!errors.terms}
				errorMessage={errors.terms}
			/>
			<IconButton loading={op[USER_OP.registring].loading} disabled={!dirty} type="submit">
				Sign Up
			</IconButton>

			{!referral && (
				<>
					<Typography className={CLASS + '-divider'}>OR</Typography>

					<BrandButton
						loading={op[DEFAULT_OP.loading].loading || op[DEFAULT_OP.load_more].loading}
						color={COLOR.secondary}
						brand={BRAND.google}
					>
						Sign up with Google
					</BrandButton>

					<BrandButton
						loading={op[DEFAULT_OP.loading].loading || op[DEFAULT_OP.load_more].loading}
						color={COLOR.secondary}
						brand={BRAND.facebook}
					>
						Sign up with Facebook
					</BrandButton>
				</>
			)}

			<Link to={LOGIN}>Already have an account? Sign in now.</Link>

			<div className={CLASS + '-terms'}>
				<Link to={TERMS_OF_SERVICE}>Terms of Service</Link>
				<Link to={PRIVACY_POLICY}>Privacy Policy</Link>
			</div>
		</form>
	);
}
