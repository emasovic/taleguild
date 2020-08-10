import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {selectUser, updateUser} from 'redux/user';

import IconButton from 'components/widgets/button/IconButton';
import FloatingInput from 'components/widgets/input/FloatingInput';
import Uploader from 'components/widgets/uploader/Uploader';
import Loader from 'components/widgets/loader/Loader';
import TextArea from 'components/widgets/textarea/TextArea';

import './UserSettings.scss';
import ThemePicker from 'components/widgets/pickers/theme/ThemePicker';

const CLASS = 'st-UserSettings';

export default function UserSettings() {
	const {data, loading} = useSelector(selectUser);
	const dispatch = useDispatch();

	const [avatar, setAvatar] = useState(null);
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [displayName, setDisplayName] = useState('');
	const [description, setDescription] = useState('');

	const update = () => {
		dispatch(
			updateUser({
				id: data.id,
				username,
				email,
				description,
				display_name: displayName,
				avatar: avatar && avatar.id,
			})
		);
	};

	useEffect(() => {
		if (data) {
			setEmail(data.email);
			setAvatar(data.avatar);
			setUsername(data.username);
			setDescription(data.description || '');
			setDisplayName(data.display_name || '');
		}
	}, [data]);

	if (!data) {
		return <Loader />;
	}

	return (
		<div className={CLASS}>
			<Uploader
				onUploaded={setAvatar}
				files={avatar}
				uploadlabel="Upload avatar"
				onRemove={() => setAvatar(null)}
			/>
			<div className={CLASS + '-info'}>
				<FloatingInput value={displayName} label="Display name" onChange={setDisplayName} />

				<TextArea value={description} label="Description" onChange={setDescription} />

				<FloatingInput value={username} label="Username" onChange={setUsername} />

				<FloatingInput value={email} label="Email address" onChange={setEmail} />

				<ThemePicker />

				<IconButton onClick={update} loading={loading}>
					Save changes
				</IconButton>
			</div>
		</div>
	);
}
