import React, {useState} from 'react';
import {Modal, ModalBody, ModalHeader, Form} from 'reactstrap';
import {useDispatch, useSelector} from 'react-redux';

import FA from 'types/font_awesome';

import {registerUser, selectUser} from '../../redux/userSlice';

import FloatingInput from '../widgets/input/FloatingInput';
import IconButton from '../widgets/button/IconButton';
import Billboard from 'components/widgets/billboard/Billboard';

import background from '../../images/cover.png';

import './SignUp.scss';

const CLASS = 'st-SignUp';

export default function SignUp(props) {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const dispatch = useDispatch();
	// const user = useSelector(selectUser);
	const submit = e => {
		e.preventDefault();
		dispatch(registerUser({username, email, password}));
	};

	const {open, onClose} = props;

	return (
		<Modal returnFocusAfterClose={true} isOpen={open} modalClassName={CLASS}>
			<ModalBody>
				<IconButton outline icon={FA.close} onClick={onClose} />
				<Billboard src={background} />

				<Form onSubmit={e => submit(e)}>
					<FloatingInput
						placeholder="Username"
						value={username}
						onChange={val => setUsername(val)}
					/>
					<FloatingInput
						placeholder="Email Address "
						value={email}
						type="email"
						onChange={val => setEmail(val)}
					/>

					<FloatingInput
						placeholder="Password"
						value={password}
						type="password"
						onChange={val => setPassword(val)}
					/>
					<IconButton>Sign Up</IconButton>
				</Form>
			</ModalBody>
		</Modal>
	);
}
