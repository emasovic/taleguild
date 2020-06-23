import React, {useState} from 'react';
import {useLocation, useHistory} from 'react-router-dom';
import {useDispatch} from 'react-redux';

import {resetPassword} from 'redux/user';

import FloatingInput from 'components/widgets/input/FloatingInput';
import IconButton from 'components/widgets/button/IconButton';

import './Password.scss';

const CLASS = 'st-Password';

export default function ResetPassword() {
	const dispatch = useDispatch();
	const history = useHistory();

	const query = new URLSearchParams(useLocation().search);

	const [password, setPassword] = useState('');
	const [passwordConfirmation, setPasswordConfirmation] = useState('');
	return (
		<div className={CLASS}>
			<FloatingInput
				onChange={setPassword}
				value={password}
				type="password"
				label="Password"
				placeholder="Enter new password"
			/>
			<FloatingInput
				onChange={setPasswordConfirmation}
				value={passwordConfirmation}
				label="Repeat password"
				placeholder="Repeat password"
			/>
			<IconButton
				onClick={() =>
					dispatch(
						resetPassword(
							{password, passwordConfirmation, code: query.get('code')},
							history
						)
					)
				}
			>
				Reset password
			</IconButton>
		</div>
	);
}