import React, {useEffect} from 'react';
import PropTypes from 'prop-types';

import {useDispatch} from 'react-redux';

import {CATEGORY_TYPES} from 'types/category';

import {loadCategories} from 'redux/categories';
import {loadLanguages} from 'redux/languages';

import CategoryPicker from 'components/widgets/pickers/category/CategoryPicker';
import Uploader from 'components/widgets/uploader/Uploader';
import LanguagePicker from 'components/widgets/pickers/language/LanguagePicker';
import ConfirmModal from 'components/widgets/modals/Modal';
import FloatingInput from 'components/widgets/input/FloatingInput';

export default function PublishStoryDialog({
	isOpen,
	className,
	onClose,
	onSubmit,
	onChange,
	onFieldValue,
	values,
	errors,
}) {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(loadCategories({type: CATEGORY_TYPES.story}));
		dispatch(loadLanguages());
	}, [dispatch]);

	const renderContent = () => {
		return (
			<form onSubmit={onSubmit}>
				<FloatingInput
					placeholder="Type title of your story here..."
					label="Title of story"
					name="title"
					value={values.title}
					onChange={onChange}
					errorMessage={errors.title}
					invalid={!!errors.title}
					wholeEvent
				/>
				<CategoryPicker
					placeholder="Pick categories"
					label="Categories"
					name="categories"
					isMulti
					onChange={val => onFieldValue('categories', val)}
					value={values.categories}
					errorMessage={errors.categories}
					invalid={!!errors.categories}
				/>
				<LanguagePicker
					placeholder="Pick language"
					label="Language"
					name="language"
					onChange={val => onFieldValue('language', val)}
					value={values.language}
					errorMessage={errors.language}
					invalid={!!errors.language}
				/>
				<FloatingInput
					rows={5}
					label="Story description"
					type="textarea"
					name="description"
					value={values.description}
					placeholder="Type description of your story here..."
					onChange={onChange}
					errorMessage={errors.description}
					invalid={!!errors.description}
					wholeEvent
				/>
				<Uploader
					onUploaded={image => onFieldValue('image', image)}
					uploadlabel="Upload cover image"
					onRemove={() => onFieldValue('image', null)}
					files={values.image}
				/>
			</form>
		);
	};

	return (
		isOpen && (
			<ConfirmModal
				isOpen={isOpen}
				onClose={onClose}
				onSubmit={onSubmit}
				content={renderContent()}
				title="Publishing"
				renderFooter
				cancelLabel="Back to edit"
				confirmLabel="Publish my story"
				className={className}
			/>
		)
	);
}

PublishStoryDialog.propTypes = {
	className: PropTypes.string,
	isOpen: PropTypes.bool,
	onClose: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
	onFieldValue: PropTypes.func.isRequired,
	values: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired,
};
