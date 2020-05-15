import React, {useState} from 'react';
import {useDispatch} from 'react-redux';

import {RESET_PASSWORD} from 'lib/routes';

import {forgotPassword} from 'redux/user';

import FloatingInput from 'components/widgets/input/FloatingInput';
import IconButton from 'components/widgets/button/IconButton';

import './Password.scss';

const CLASS = 'st-Password';

export default function ForgotPassword() {
	const dispatch = useDispatch();
	const [email, setEmail] = useState('');
	return (
		<div className={CLASS}>
			<FloatingInput onChange={setEmail} value={email} placeholder="Unesite email" />
			<IconButton
				onClick={() =>
					dispatch(forgotPassword({email, url: `localhost:3000/${RESET_PASSWORD}`}))
				}
			>
				Pošalji
			</IconButton>
		</div>
	);
}
