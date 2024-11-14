import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useFormik} from 'formik';
import {object, string} from 'yup';

import {DEFAULT_OP} from 'types/default';
import {usernameRegex} from 'types/regex';

import {selectAuthUser, updateUser} from 'redux/auth';
import {selectApp} from 'redux/app';

import IconButton from 'components/widgets/button/IconButton';
import FloatingInput from 'components/widgets/input/FloatingInput';
import Uploader from 'components/widgets/uploader/Uploader';
import Loader from 'components/widgets/loader/Loader';
import TextArea from 'components/widgets/textarea/TextArea';
import MobileWrapper from 'components/widgets/mobile-wrapper/MobileWrapper';
import {CROP_SHAPE} from 'components/widgets/image-cropper/ImageCropper';

import './UserSettings.scss';

const CLASS = 'st-UserSettings';

const validationSchema = object().shape({
	username: string()
		.min(2, 'Too Short!')
		.max(50, 'Too Long!')
		.matches(usernameRegex.regex, usernameRegex.message)
		.required('Required'),
	description: string()
		.min(2, 'Too Short!')
		.max(250, 'Too Long!'),
	displayName: string()
		.min(2, 'Too Short!')
		.max(250, 'Too Long!'),
	email: string()
		.required('Required')
		.email('Must be a valid email'),
});

export default function UserSettings() {
	const {data, op} = useSelector(selectAuthUser);
	const {cropActive} = useSelector(selectApp);
	const dispatch = useDispatch();

	const handleSubmit = val => {
		localStorage.setItem('theme', val.theme);
		dispatch(
			updateUser({
				id: val.id,
				username: val.username,
				email: val.email,
				description: val.description,
				display_name: val.displayName,
				avatar: val?.avatar?.id || null,
			})
		);
	};

	const {
		values: {avatar, displayName, username, email, description},
		errors,
		dirty,
		handleSubmit: formikSubmit,
		handleChange,
		setFieldValue,
	} = useFormik({
		validationSchema,
		enableReinitialize: true,
		validateOnChange: false,
		initialValues: {
			id: data?.id,
			username: data?.username || '',
			email: data?.email || '',
			description: data?.description || '',
			displayName: data?.display_name || '',
			avatar: data?.avatar,
		},
		onSubmit: handleSubmit,
	});

	if (!data) return <Loader />;

	return (
		<MobileWrapper className={CLASS}>
			<form onSubmit={formikSubmit} className={CLASS + '-form'}>
				<Uploader
					onUploaded={image => setFieldValue('avatar', image)}
					files={avatar}
					uploadlabel="Upload avatar"
					cropShape={CROP_SHAPE.round}
					onRemove={() => setFieldValue('avatar', null)}
				/>
				<div className={CLASS + '-form-info'}>
					<FloatingInput
						value={displayName}
						label="Display name"
						name="displayName"
						onChange={handleChange}
						wholeEvent
						invalid={!!errors.displayName}
						errorMessage={errors.displayName}
					/>

					<TextArea
						value={description}
						name="description"
						label="Description"
						onChange={handleChange}
						wholeEvent
						invalid={!!errors.description}
						errorMessage={errors.description}
					/>

					<FloatingInput
						value={username}
						name="username"
						label="Username"
						onChange={handleChange}
						wholeEvent
						invalid={!!errors.username}
						errorMessage={errors.username}
					/>

					<FloatingInput
						value={email}
						name="email"
						label="Email address"
						onChange={handleChange}
						wholeEvent
						invalid={!!errors.email}
						errorMessage={errors.email}
					/>

					<IconButton
						loading={op[DEFAULT_OP.update].loading}
						disabled={!dirty || cropActive}
					>
						Save changes
					</IconButton>
				</div>
			</form>
		</MobileWrapper>
	);
}
