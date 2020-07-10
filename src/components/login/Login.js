import React, {useState} from 'react';
import {Modal, ModalBody, Form, ModalHeader} from 'reactstrap';
import {useDispatch, useSelector} from 'react-redux';
import {Link} from 'react-router-dom';

import {FORGOT_PASSWORD} from 'lib/routes';

import {loginUser, selectUser} from '../../redux/user';

import FloatingInput from '../widgets/input/FloatingInput';
import IconButton from '../widgets/button/IconButton';
import Billboard from 'components/widgets/billboard/Billboard';

// import background from '../../images/cover.png';

import './Login.scss';

const CLASS = 'st-Login';

export default function Login(props) {
	const [identifier, setIdentifier] = useState('');
	const [password, setPassword] = useState('');
	const dispatch = useDispatch();
	const user = useSelector(selectUser);
	const {error, op} = user;

	const submit = e => {
		e.preventDefault();
		dispatch(loginUser({identifier, password}));
	};

	const {open, onClose, onChange} = props;

	return (
		<Modal returnFocusAfterClose={true} isOpen={open} modalClassName={CLASS}>
			<ModalHeader toggle={onClose} />
			<ModalBody>
				<Billboard />

				<Form onSubmit={e => submit(e)}>
					<h4>Welcome Back</h4>
					<FloatingInput
						label="Email or username"
						placeholder="Enter your email or username"
						value={identifier}
						type="text"
						onChange={val => setIdentifier(val)}
					/>

					<FloatingInput
						label="Enter password"
						placeholder="you@example.com"
						value={password}
						type="password"
						onChange={val => setPassword(val)}
						errorMessage={error}
						invalid={!!error}
					/>
					<Link to={FORGOT_PASSWORD} onClick={onClose}>
						Forgot password?
					</Link>
					<IconButton loading={op}>Sign in</IconButton>
					<Link to="#" onClick={onChange}>
						Don’t have an account? Sign up now.
					</Link>
				</Form>
			</ModalBody>
		</Modal>
	);
}
