import React, {useState} from 'react';
import {Modal, ModalBody, Form, ModalHeader} from 'reactstrap';
import {useDispatch, useSelector} from 'react-redux';
import {Link, useHistory} from 'react-router-dom';

import {Toast} from 'types/toast';
import {COLOR, BRAND} from 'types/button';

import {emailRegExp} from 'lib/util';

import {registerUser} from '../../redux/user';
import {addToast} from 'redux/toast';

import FloatingInput from '../widgets/input/FloatingInput';
import IconButton from '../widgets/button/IconButton';
import BrandButton from 'components/widgets/button/BrandButton';
import Checkbox from 'components/widgets/checkbox/Checkbox';
import Billboard from 'components/widgets/billboard/Billboard';

import './SignUp.scss';

const CLASS = 'st-SignUp';

export default function SignUp(props) {
	const history = useHistory();

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
			dispatch(registerUser({username, email, password}, history));
		}
	};

	const {open, onClose, onChange} = props;

	return (
		<Modal returnFocusAfterClose={true} isOpen={open} toggle={onClose} modalClassName={CLASS}>
			<ModalHeader toggle={onClose} />
			<ModalBody>
				<Billboard />

				<Form onSubmit={e => submit(e)}>
					<h4>Join our guild of writers and storytellers</h4>
					<FloatingInput
						label="Username"
						// placeholder="Enter your username here"
						value={username}
						onChange={val => setUsername(val)}
					/>
					<FloatingInput
						label="Email Address "
						// placeholder="Enter your email address here"
						value={email}
						type="email"
						onChange={val => setEmail(val)}
					/>

					<FloatingInput
						label="Password"
						// placeholder="you@example.com"
						value={password}
						type="password"
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
					<IconButton loading={op}>Sign Up</IconButton>

					<BrandButton loading={op} color={COLOR.secondary} brand={BRAND.google}>
						Sign up with Google
					</BrandButton>

					<BrandButton loading={op} color={COLOR.secondary} brand={BRAND.facebook}>
						Sign up with Facebook
					</BrandButton>
					<Link to="#" onClick={onChange}>
						Already have an account? Sign in now.
					</Link>
				</Form>
			</ModalBody>
		</Modal>
	);
}
