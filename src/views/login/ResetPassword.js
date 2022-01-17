import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {object, string, ref} from 'yup';
import {useFormik} from 'formik';

import {USER_OP} from 'types/user';
import {FONTS, TYPOGRAPHY_VARIANTS} from 'types/typography';

import {resetPassword} from 'redux/auth';

import {useGetSearchParams} from 'hooks/getSearchParams';

import FloatingInput from 'components/widgets/input/FloatingInput';
import IconButton from 'components/widgets/button/IconButton';
import Typography from 'components/widgets/typography/Typography';

import './Password.scss';

const CLASS = 'st-Password';

const validationSchema = object().shape({
	password: string()
		.required('Please Enter your password')
		.matches(
			/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
			'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character'
		),
	passwordConfirmation: string()
		.oneOf([ref('password'), null], 'Passwords must match')
		.required('Please repeat your password'),
});

export default function ResetPassword() {
	const dispatch = useDispatch();
	const {op} = useSelector(state => state.auth);
	const {code} = useGetSearchParams();

	const handleSubmit = ({password, passwordConfirmation}) => {
		dispatch(resetPassword({password, passwordConfirmation, code}));
		resetForm();
	};
	const {values, dirty, errors, handleSubmit: formikSubmit, resetForm, handleChange} = useFormik({
		validationSchema,
		validateOnChange: false,
		initialValues: {
			password: '',
			passwordConfirmation: '',
		},
		onSubmit: handleSubmit,
	});
	return (
		<div className={CLASS}>
			<form onSubmit={formikSubmit}>
				<Typography
					variant={TYPOGRAPHY_VARIANTS.h4}
					component={TYPOGRAPHY_VARIANTS.h4}
					font={FONTS.merri}
				>
					Reset password
				</Typography>
				<FloatingInput
					onChange={handleChange}
					value={values.password}
					name="password"
					type="password"
					label="Password"
					placeholder="Enter new password"
					invalid={!!errors.password}
					errorMessage={errors.password}
					wholeEvent
				/>
				<FloatingInput
					onChange={handleChange}
					value={values.passwordConfirmation}
					name="passwordConfirmation"
					label="Repeat password"
					placeholder="Repeat password"
					type="password"
					invalid={!!errors.passwordConfirmation}
					errorMessage={errors.passwordConfirmation}
					wholeEvent
				/>
				<IconButton loading={op[USER_OP.reset_password].loading} disabled={!dirty}>
					Reset password
				</IconButton>
			</form>
		</div>
	);
}
