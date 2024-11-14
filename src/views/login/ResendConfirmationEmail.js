import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {object, string} from 'yup';
import {useFormik} from 'formik';

import {USER_OP} from 'types/user';
import {FONTS, FONT_WEIGHT, TYPOGRAPHY_VARIANTS} from 'types/typography';

import {resendConfirmationEmail} from 'redux/auth';

import FloatingInput from 'components/widgets/input/FloatingInput';
import IconButton from 'components/widgets/button/IconButton';
import Typography from 'components/widgets/typography/Typography';

import './Password.scss';

const CLASS = 'st-Password';

const validationSchema = object().shape({
	email: string()
		.required('Required')
		.email('Must be a valid email'),
});

export default function ResendConfirmationEmail() {
	const dispatch = useDispatch();
	const {op} = useSelector(state => state.auth);
	const handleSubmit = ({email}) => {
		dispatch(resendConfirmationEmail({email}));
		resetForm();
	};

	const {values, dirty, errors, handleSubmit: formikSubmit, resetForm, handleChange} = useFormik({
		validationSchema,
		validateOnChange: false,
		initialValues: {
			email: '',
		},
		onSubmit: handleSubmit,
	});

	return (
		<div className={CLASS}>
			<form onSubmit={formikSubmit}>
				<Typography
					variant={TYPOGRAPHY_VARIANTS.h4}
					component={TYPOGRAPHY_VARIANTS.h4}
					fontWeight={FONT_WEIGHT.bold}
					font={FONTS.merri}
				>
					Resend email
				</Typography>

				<FloatingInput
					onChange={handleChange}
					value={values.email}
					label="Email address"
					placeholder="Enter your email"
					name="email"
					errorMessage={errors.email}
					invalid={!!errors.email}
					wholeEvent
				/>
				<IconButton
					loading={op[USER_OP.resend_confirmation_email].loading}
					disabled={!dirty}
				>
					Submit
				</IconButton>
			</form>
		</div>
	);
}
