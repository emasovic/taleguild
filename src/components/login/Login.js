import React, {useState} from 'react';
import {Modal, ModalBody, ModalHeader, Form} from 'reactstrap';

import {useDispatch, useSelector} from 'react-redux';

import {loginUser, logOut, selectUser} from '../../redux/userSlice';

import FloatingInput from '../widgets/input/FloatingInput';
import IconButton from '../widgets/button/IconButton';

import './Login.scss';

const CLASS = 'st-Login';

export default function Login(props) {
	const [identifier, setIdentifier] = useState('');
	const [password, setPassword] = useState('');
	const dispatch = useDispatch();
	// const user = useSelector(selectUser);
	const submit = e => {
		e.preventDefault();
		dispatch(loginUser({identifier, password}));
	};

	const {open, onClose} = props;

	return (
		<Modal returnFocusAfterClose={true} isOpen={open} modalClassName={CLASS}>
			<ModalHeader toggle={onClose}>Welcome Back</ModalHeader>
			<ModalBody>
				<Form onSubmit={e => submit(e)}>
					<FloatingInput
						placeholder="Email Address "
						value={identifier}
						type="email"
						onChange={val => setIdentifier(val)}
					/>

					<FloatingInput
						placeholder="Password"
						value={password}
						type="password"
						onChange={val => setPassword(val)}
					/>
					<IconButton>Login to your Account</IconButton>
				</Form>
			</ModalBody>
		</Modal>
	);
}
