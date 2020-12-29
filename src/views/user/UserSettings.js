import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {THEMES} from 'types/themes';

import {selectUser, updateUser} from 'redux/user';

import IconButton from 'components/widgets/button/IconButton';
import FloatingInput from 'components/widgets/input/FloatingInput';
import Uploader from 'components/widgets/uploader/Uploader';
import Loader from 'components/widgets/loader/Loader';
import TextArea from 'components/widgets/textarea/TextArea';
import ThemePicker from 'components/widgets/pickers/theme/ThemePicker';

import './UserSettings.scss';

const CLASS = 'st-UserSettings';

export default function UserSettings() {
	const {data, loading} = useSelector(selectUser);
	const dispatch = useDispatch();

	const [avatar, setAvatar] = useState(null);
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [displayName, setDisplayName] = useState('');
	const [description, setDescription] = useState('');
	const [theme, setTheme] = useState(null);

	const update = () => {
		localStorage.setItem('theme', theme);
		dispatch(
			updateUser({
				id: data.id,
				username,
				email,
				description,
				theme,
				display_name: displayName,
				avatar: avatar && avatar.id,
			})
		);
	};

	useEffect(() => {
		if (data) {
			const theme = localStorage.getItem('theme') || THEMES.dark;
			setEmail(data.email);
			setAvatar(data.avatar);
			setUsername(data.username);
			setDescription(data.description || '');
			setDisplayName(data.display_name || '');
			setTheme(theme);
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

				<ThemePicker value={theme} onChange={setTheme} />

				<IconButton onClick={update} loading={loading}>
					Save changes
				</IconButton>
			</div>
		</div>
	);
}
