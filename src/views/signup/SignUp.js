import React, {useState} from 'react';
import {Form} from 'reactstrap';
import {useDispatch, useSelector} from 'react-redux';
import {Link} from 'react-router-dom';

import {LOGIN} from 'lib/routes';

import {Toast} from 'types/toast';
import {COLOR, BRAND} from 'types/button';

import {emailRegExp} from 'lib/util';

import {registerUser} from '../../redux/user';
import {addToast} from 'redux/toast';

import FloatingInput from '../../components/widgets/input/FloatingInput';
import IconButton from '../../components/widgets/button/IconButton';
import BrandButton from 'components/widgets/button/BrandButton';
import Checkbox from 'components/widgets/checkbox/Checkbox';

import './SignUp.scss';

const CLASS = 'st-SignUp';

export default function SignUp() {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	// const [repeatPassword, setRepeatPassword] = useState('');
	const [accepted, setAccepted] = useState(false);

	const dispatch = useDispatch();
	const op = useSelector(state => state.user.op);

	const validate = () => {
		const errors = [];

		!accepted && errors.push('You didnt accepted terms and conditions! \n');
		// password !== repeatPassword && errors.push('Passwords dont match!');
		!emailRegExp.test(email) && errors.push('Invalid email! \n');

		if (errors.length) {
			return dispatch(addToast(Toast.error(errors)));
		}

		return true;
	};

	const submit = e => {
		e.preventDefault();
		if (validate()) {
			dispatch(registerUser({username, email, password}));
		}
	};

	return (
		<Form onSubmit={e => submit(e)} className={CLASS}>
			<h4>Join our guild of writers and storytellers</h4>
			<FloatingInput label="Username" value={username} onChange={val => setUsername(val)} />

			<FloatingInput
				label="Email Address "
				value={email}
				type="email"
				onChange={val => setEmail(val)}
			/>

			<FloatingInput
				label="Password"
				value={password}
				type="password"
				autoComplete="on"
				onChange={val => setPassword(val)}
				// invalid={!!error}
				// errorMessage={error}
			/>
			{/* <FloatingInput
						label="Repeat Password"
						value={repeatPassword}
						type="password"
						onChange={val => setRepeatPassword(val)}
						invalid={!!error}
						errorMessage={error}
					/> */}
			<Checkbox
				label="I agree to Terms of Service and Privacy Policy"
				checked={accepted}
				onChange={checked => setAccepted(checked)}
			/>
			<IconButton loading={!!op}>Sign Up</IconButton>

			<span className={CLASS + '-divider'}>OR</span>

			<BrandButton loading={!!op} color={COLOR.secondary} brand={BRAND.google}>
				Sign up with Google
			</BrandButton>

			<BrandButton loading={!!op} color={COLOR.secondary} brand={BRAND.facebook}>
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
		</Form>
	);
}
