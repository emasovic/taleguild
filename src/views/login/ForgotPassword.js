import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {RESET_PASSWORD} from 'lib/routes';

import {USER_OP} from 'types/user';

import {forgotPassword} from 'redux/user';

import FloatingInput from 'components/widgets/input/FloatingInput';
import IconButton from 'components/widgets/button/IconButton';

import './Password.scss';

const CLASS = 'st-Password';

const API = 'https://taleguild.com';

export default function ForgotPassword() {
	const dispatch = useDispatch();
	const op = useSelector(state => state.user.op);
	const [email, setEmail] = useState('');

	return (
		<div className={CLASS}>
			<FloatingInput
				onChange={setEmail}
				value={email}
				label="Email address"
				placeholder="Enter your email"
			/>
			<IconButton
				onClick={() => dispatch(forgotPassword({email, url: API + RESET_PASSWORD}))}
				loading={op === USER_OP.forgot_password}
			>
				Send
			</IconButton>
		</div>
	);
}
