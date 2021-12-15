import React from 'react';
import PropTypes from 'prop-types';
import {useFormik} from 'formik';
import {useDispatch, useSelector} from 'react-redux';
import * as Yup from 'yup';

import {capitalize, getImageUrl} from 'lib/util';
import {getGenders} from 'lib/api';

import {createOrUpdateGuildatar, selectGuildatarById} from 'redux/guildatars';
import {selectAuthUser} from 'redux/auth';

import {useLoadItems} from 'hooks/getItems';

import DefaultPicker from 'components/widgets/pickers/default/DefaultPicker';
import ConfirmModal from 'components/widgets/modals/Modal';
import FloatingInput from 'components/widgets/input/FloatingInput';
import TextArea from 'components/widgets/textarea/TextArea';
import Checkbox from 'components/widgets/checkbox/Checkbox';

import Guildatar from './Guildatar';

import './GuildatarDialog.scss';

const CLASS = 'st-GuildatarDialog';

const validationSchema = Yup.object().shape({
	name: Yup.string()
		.min(2, 'Too Short!')
		.max(50, 'Too Long!')
		.required('Required'),
	description: Yup.string()
		.min(2, 'Too Short!')
		.max(250, 'Too Long!')
		.required('Required'),
	gender: Yup.mixed().required('Required'),
});

function GuildatarDialog({isOpen, onClose, id}) {
	const dispatch = useDispatch();
	const [{data: genders}] = useLoadItems(getGenders);

	const options = genders.map(i => ({value: i.id, label: capitalize(i.gender)}));

	const {data} = useSelector(selectAuthUser);
	const {op} = useSelector(state => state.guildatars);
	const guildatar = useSelector(state => selectGuildatarById(state, id));

	const {head, face, body, left_arm, right_arm, active} = guildatar || {};

	const handleSubmit = values => {
		const payload = {
			...values,
			id,
			user: data.id,
			gender: values.gender.value,
		};

		if (data?.id) {
			dispatch(createOrUpdateGuildatar(payload));
			onClose();
		}
	};

	const {
		values,
		errors,
		dirty,
		handleSubmit: formikSubmit,
		handleChange,
		setFieldValue,
	} = useFormik({
		validationSchema,
		validateOnChange: false,
		initialValues: {
			active,
			name: guildatar?.name || '',
			description: guildatar?.description || '',
			gender: options.find(i => i.value === guildatar?.gender?.id) || null,
		},
		onSubmit: handleSubmit,
	});

	const renderContent = () => (
		<div className={CLASS}>
			<form onSubmit={formikSubmit}>
				<div className={CLASS + '-guildatar'}>
					<Guildatar
						head={getImageUrl(head?.item?.image?.url)}
						face={getImageUrl(face?.item?.image?.url)}
						body={getImageUrl(body?.item?.image?.url)}
						leftArm={getImageUrl(left_arm?.item?.image?.url)}
						rightArm={getImageUrl(right_arm?.item?.image?.url)}
						gender={values?.gender?.label.toLowerCase()}
					/>
				</div>

				<FloatingInput
					label="Name"
					placeholder="Enter guildatar's name..."
					name="name"
					onChange={handleChange}
					wholeEvent
					value={values.name}
					invalid={!!errors.name}
					errorMessage={errors.name}
				/>

				<DefaultPicker
					options={options}
					placeholder="Choose guildatar's gender..."
					label="Gender"
					name="gender"
					onChange={val => setFieldValue('gender', val)}
					value={values.gender}
					invalid={!!errors.gender}
					errorMessage={errors.gender}
					isDisabled={!!id}
					isSearchable={false}
				/>
				{id && (
					<Checkbox
						label="Select as default guildatar"
						checked={values.active}
						onChange={val => setFieldValue('active', val)}
						withBorder
					/>
				)}
				<TextArea
					className={CLASS + '-textarea'}
					label="Description"
					placeholder="Write something about guildatar..."
					name="description"
					onChange={handleChange}
					wholeEvent
					value={values.description}
					invalid={!!errors.description}
					errorMessage={errors.description}
				/>
			</form>
		</div>
	);

	const title = id ? 'Edit Guildatar' : 'New Guildatar';
	return (
		isOpen && (
			<ConfirmModal
				title={title}
				cancelLabel="Cancel"
				confirmLabel="Save"
				isOpen={isOpen}
				onClose={onClose}
				submitButtonProps={{disabled: !!op || !dirty, loading: !!op}}
				content={renderContent()}
				onSubmit={formikSubmit}
			/>
		)
	);
}

GuildatarDialog.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	id: PropTypes.number,
};

export default GuildatarDialog;
