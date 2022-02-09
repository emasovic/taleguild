import React from 'react';

import {useDispatch, useSelector} from 'react-redux';
import {Link} from 'react-router-dom';
import {boolean, object, string} from 'yup';
import {useFormik} from 'formik';

import {LOGIN} from 'lib/routes';

import {FONTS, FONT_WEIGHT, TYPOGRAPHY_VARIANTS} from 'types/typography';
import {COLOR, BRAND} from 'types/button';
import {USER_OP} from 'types/user';
import {DEFAULT_OP} from 'types/default';

import {registerUser} from 'redux/auth';

import FloatingInput from 'components/widgets/input/FloatingInput';
import IconButton from 'components/widgets/button/IconButton';
import BrandButton from 'components/widgets/button/BrandButton';
import Checkbox from 'components/widgets/checkbox/Checkbox';
import Typography from 'components/widgets/typography/Typography';

import './SignUp.scss';
import {useGetSearchParams} from 'hooks/getSearchParams';

const CLASS = 'st-SignUp';

const validationSchema = object().shape({
	username: string()
		.min(2, 'Too Short!')
		.max(50, 'Too Long!')
		.required('Required'),
	password: string()
		.required('Please Enter your password')
		.matches(
			/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
			'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character'
		),
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

			<Link to={LOGIN}>Already have an account? Sign in now.</Link>

			<div className={CLASS + '-terms'}>
				<a
					href="https://join.taleguild.com/terms-of-service"
					target="_blank"
					rel="noopener noreferrer"
				>
					Terms of Service
				</a>
				<a
					href="https://join.taleguild.com/privacy-policy"
					target="_blank"
					rel="noopener noreferrer"
				>
					Privacy Policy
				</a>
			</div>
		</form>
	);
}
