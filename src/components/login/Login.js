import React, {useState} from 'react';
import {Modal, ModalBody, Form} from 'reactstrap';
import {useDispatch, useSelector} from 'react-redux';

import FA from 'types/font_awesome';

import {loginUser, selectUser} from '../../redux/userSlice';

import FloatingInput from '../widgets/input/FloatingInput';
import IconButton from '../widgets/button/IconButton';
import Billboard from 'components/widgets/billboard/Billboard';

import background from '../../images/cover.png';

import './Login.scss';

const CLASS = 'st-Login';

export default function Login(props) {
	const [identifier, setIdentifier] = useState('');
	const [password, setPassword] = useState('');
	const dispatch = useDispatch();
	const user = useSelector(selectUser);
	const {error} = user;

	const submit = e => {
		e.preventDefault();
		dispatch(loginUser({identifier, password}));
	};

	const {open, onClose} = props;

	return (
		<Modal returnFocusAfterClose={true} isOpen={open} modalClassName={CLASS}>
			<ModalBody>
				<IconButton outline icon={FA.close} onClick={onClose} />
				<Billboard src={background} />

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
						errorMessage={error}
						invalid={!!error}
					/>
					<IconButton>Login</IconButton>
				</Form>
			</ModalBody>
		</Modal>
	);
}
