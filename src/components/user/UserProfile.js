import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {selectUser, updateUser} from 'redux/user';

import IconButton from 'components/widgets/button/IconButton';
import FloatingInput from 'components/widgets/input/FloatingInput';
import Uploader from 'components/widgets/uploader/Uploader';
import Loader from 'components/widgets/loader/Loader';

import './UserProfile.scss';

const CLASS = 'st-UserProfile';

export default function UserProfile() {
	const {data} = useSelector(selectUser);
	const dispatch = useDispatch();

	const [avatar, setAvatar] = useState(null);
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [firstName, setFirstName] = useState('');

	const update = () => {
		dispatch(
			updateUser(data.token, {
				id: data.id,
				username,
				email,
				first_name: firstName,
				avatar: avatar && avatar.id,
			})
		);
	};

	useEffect(() => {
		if (data) {
			setEmail(data.email);
			setAvatar(data.avatar);
			setUsername(data.username);
			setFirstName(data.first_name || '');
		}
	}, [data]);

	if (!data) {
		return <Loader />;
	}

	return (
		<div className={CLASS}>
			<div className={CLASS + '-info'}>
				<FloatingInput
					value={username}
					placeholder="Korisničko ime"
					onChange={setUsername}
				/>
				<FloatingInput value={firstName} placeholder="Ime" onChange={setFirstName} />
				<FloatingInput value={email} placeholder="Email adresa" onChange={setEmail} />
			</div>
			<Uploader onUploaded={setAvatar} previewImage={avatar} />

			<IconButton onClick={update}>Sačuvaj</IconButton>
		</div>
	);
}
