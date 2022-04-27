import React from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import {useDispatch, useSelector} from 'react-redux';
import {selectApp} from 'redux/app';
import {createOrUpdateProject, selectProject} from 'redux/projects';
import {selectAuthUser} from 'redux/auth';
import {useFormik} from 'formik';
import FloatingInput from 'components/widgets/input/FloatingInput';
import {ASPECT_RATIO, OBJECT_FIT} from 'components/widgets/image-cropper/ImageCropper';
import Uploader from 'components/widgets/uploader/Uploader';
import ConfirmModal from 'components/widgets/modals/Modal';

const validationSchema = Yup.object().shape({
	name: Yup.string()
		.min(2, 'Too Short!')
		.max(50, 'Too Long!')
		.required('Required'),
});

function ProjectsDialog({type, id, onClose, isOpen}) {
	const dispatch = useDispatch();

	const {cropActive} = useSelector(selectApp);
	const project = useSelector(state => selectProject(state, id));
	const {data} = useSelector(selectAuthUser);

	const handleSubmit = values => {
		const payload = {
			...values,
			id,
			user: data.id,
			type,
			image: values?.image?.id,
		};

		if (data?.id) {
			dispatch(createOrUpdateProject(payload));
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
		enableReinitialize: true,
		validateOnChange: false,
		initialValues: {
			name: project?.name || '',
			image: project?.image,
			type: project?.type || type,
		},
		onSubmit: handleSubmit,
	});

	console.log(values);

	const renderContent = () => {
		return (
			<form onSubmit={formikSubmit}>
				<FloatingInput
					placeholder="Type name of your project here..."
					label="Name of project"
					name="name"
					value={values.name}
					onChange={handleChange}
					errorMessage={errors.name}
					invalid={!!errors.name}
					wholeEvent
				/>

				<Uploader
					onUploaded={image => setFieldValue('image', image)}
					uploadlabel="Upload cover image"
					onRemove={() => setFieldValue('image', null)}
					files={values.image}
					aspect={ASPECT_RATIO.rectangle}
					objectFit={OBJECT_FIT.horizontalCover}
				/>
			</form>
		);
	};

	const title = id ? 'Edit project' : 'New project';
	return (
		isOpen && (
			<ConfirmModal
				isOpen={isOpen}
				onClose={onClose}
				onSubmit={formikSubmit}
				submitButtonProps={{disabled: cropActive || !dirty}}
				content={renderContent()}
				title={title}
				renderFooter
				cancelLabel="Cancel"
				confirmLabel="Publish my story"
				// className={className}
			/>
		)
	);
}

ProjectsDialog.propTypes = {
	type: PropTypes.string.isRequired,
	id: PropTypes.number,
	onClose: PropTypes.func.isRequired,
	isOpen: PropTypes.bool.isRequired,
};

export default ProjectsDialog;
