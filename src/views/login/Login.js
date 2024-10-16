import React, {useState} from 'react';
import {Form} from 'reactstrap';
import {useDispatch, useSelector} from 'react-redux';
import {Link} from 'react-router-dom';

import {FORGOT_PASSWORD, REGISTER} from 'lib/routes';

import {COLOR, BRAND} from 'types/button';

import {loginUser, selectUser} from '../../redux/user';

import FloatingInput from '../../components/widgets/input/FloatingInput';
import IconButton from '../../components/widgets/button/IconButton';
import BrandButton from 'components/widgets/button/BrandButton';

import './Login.scss';

const CLASS = 'st-Login';

export default function Login() {
	const [identifier, setIdentifier] = useState('');
	const [password, setPassword] = useState('');
	const dispatch = useDispatch();
	const user = useSelector(selectUser);
	const {error, op} = user;

	const submit = e => {
		e.preventDefault();
		dispatch(loginUser({identifier, password}));
	};

	return (
		<Form onSubmit={e => submit(e)} className={CLASS}>
			<h4>Welcome Back</h4>
			<FloatingInput
				label="Email or username"
				// placeholder="Enter your email or username"
				value={identifier}
				type="text"
				onChange={val => setIdentifier(val)}
			/>

			<FloatingInput
				label="Enter password"
				// placeholder="you@example.com"
				value={password}
				type="password"
				onChange={val => setPassword(val)}
				errorMessage={error}
				invalid={!!error}
			/>

			<Link to={FORGOT_PASSWORD}>Forgot password?</Link>

			<IconButton loading={!!op}>Sign in</IconButton>

			<span className={CLASS + '-divider'}>OR</span>

			<BrandButton loading={!!op} color={COLOR.secondary} brand={BRAND.google}>
				Sign in with Google
			</BrandButton>

			<BrandButton loading={!!op} color={COLOR.secondary} brand={BRAND.facebook}>
				Sign in with Facebook
			</BrandButton>

			<Link to={REGISTER}>Don’t have an account? Sign up now.</Link>
		</Form>
	);
}
