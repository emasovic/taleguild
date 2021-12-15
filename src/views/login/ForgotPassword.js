import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {RESET_PASSWORD} from 'lib/routes';

import {USER_OP} from 'types/user';

import {forgotPassword} from 'redux/auth';

import FloatingInput from 'components/widgets/input/FloatingInput';
import IconButton from 'components/widgets/button/IconButton';

import './Password.scss';

const CLASS = 'st-Password';

export default function ForgotPassword() {
	const dispatch = useDispatch();
	const op = useSelector(state => state.auth.op);
	const [email, setEmail] = useState('');

	return (
		<div className={CLASS}>
			<h4>Forgot password?</h4>
			<FloatingInput
				onChange={setEmail}
				value={email}
				label="Email address"
				placeholder="Enter your email"
			/>
			<IconButton
				onClick={() =>
					dispatch(
						forgotPassword({email, url: process.env.REACT_APP_API_URL + RESET_PASSWORD})
					)
				}
				loading={op === USER_OP.forgot_password}
			>
				Send
			</IconButton>
		</div>
	);
}
