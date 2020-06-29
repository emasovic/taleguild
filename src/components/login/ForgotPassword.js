import React, {useState} from 'react';
import {useDispatch} from 'react-redux';

import {RESET_PASSWORD} from 'lib/routes';

import {forgotPassword} from 'redux/user';

import FloatingInput from 'components/widgets/input/FloatingInput';
import IconButton from 'components/widgets/button/IconButton';

import './Password.scss';

const CLASS = 'st-Password';

const API = 'https://taleguild.com';

export default function ForgotPassword() {
	const dispatch = useDispatch();
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
			>
				Send
			</IconButton>
		</div>
	);
}
