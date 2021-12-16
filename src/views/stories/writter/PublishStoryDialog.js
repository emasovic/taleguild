import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Form} from 'reactstrap';
import {useParams} from 'react-router-dom';
import {useDispatch} from 'react-redux';

import {CATEGORY_TYPES} from 'types/category';

import {loadCategories} from 'redux/categories';
import {loadLanguages} from 'redux/languages';

import CategoryPicker from 'components/widgets/pickers/category/CategoryPicker';
import Uploader from 'components/widgets/uploader/Uploader';
import LanguagePicker from 'components/widgets/pickers/language/LanguagePicker';
import ConfirmModal from 'components/widgets/modals/Modal';
import FloatingInput from 'components/widgets/input/FloatingInput';

const ERRORS = {
	TITLE: 'TITLE',
	CATEGORIES: 'CATEGORIES',
	DESCRIPTION: 'DESCRIPTION',
	LANGUAGE: 'LANGUAGE',
};

export default function PublishStoryDialog({
	isOpen,
	className,
	onClose,
	onCreateOrUpdateStory,
	story,
	setTitle,
	setDescription,
	setCategories,
	setLanguage,
	setImage,
}) {
	const {id} = useParams();
	const dispatch = useDispatch();

	const {title, description, categories, language, image, published} = story;

	const [errors, setErrors] = useState({});

	useEffect(() => {
		dispatch(loadCategories({type: CATEGORY_TYPES.story}));
		dispatch(loadLanguages());
	}, [dispatch]);

	const validate = () => {
		const hasErrors = new Map();

		title.length <= 3 && hasErrors.set(ERRORS.TITLE, 'Title too short.');

		!categories?.length && hasErrors.set(ERRORS.CATEGORIES, `You didn't pick category.`);

		categories?.length > 3 &&
			hasErrors.set(ERRORS.CATEGORIES, 'You can pick maximum 3 categories.');

		!language && hasErrors.set(ERRORS.LANGUAGE, `You didn't pick language.`);

		description.length <= 3 && hasErrors.set(ERRORS.DESCRIPTION, 'Description too short.');

		description.length >= 200 && hasErrors.set(ERRORS.DESCRIPTION, 'Description too long.');

		if (hasErrors.size) {
			return setErrors(Object.fromEntries(hasErrors));
		}

		return true;
	};

	const create = () => {
		if (validate()) {
			const payload = {
				id,
				title,
				image: image && image.id,
				description,
				categories: categories.length && categories.map(item => item.value),
				language: language && language.value,
				published_at: !published ? new Date() : undefined,
				archived_at: null,
			};

			onCreateOrUpdateStory(payload);
		}
	};

	const renderContent = () => {
		return (
			<Form onSubmit={create}>
				<FloatingInput
					placeholder="Type title of your story here..."
					label="Title of story"
					value={title}
					onChange={val => setTitle(val)}
					errorMessage={errors[ERRORS.TITLE]}
					invalid={!!errors[ERRORS.TITLE]}
				/>
				<CategoryPicker
					placeholder="Pick categories"
					label="Categories"
					isMulti
					onChange={setCategories}
					value={categories}
					errorMessage={errors[ERRORS.CATEGORIES]}
					invalid={!!errors[ERRORS.CATEGORIES]}
				/>
				<LanguagePicker
					placeholder="Pick language"
					label="Language"
					onChange={setLanguage}
					value={language}
					errorMessage={errors[ERRORS.LANGUAGE]}
					invalid={!!errors[ERRORS.LANGUAGE]}
				/>
				<FloatingInput
					rows={5}
					label="Story description"
					type="textarea"
					value={description}
					placeholder="Type description of your story here..."
					onChange={val => setDescription(val)}
					errorMessage={errors[ERRORS.DESCRIPTION]}
					invalid={!!errors[ERRORS.DESCRIPTION]}
				/>
				<Uploader
					onUploaded={setImage}
					uploadlabel="Upload cover image"
					onRemove={() => setImage(null)}
					files={image}
				/>
			</Form>
		);
	};

	return (
		isOpen && (
			<ConfirmModal
				isOpen={isOpen}
				onClose={onClose}
				onSubmit={create}
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
	storyId: PropTypes.string,
	className: PropTypes.string,
	isOpen: PropTypes.bool,
	story: PropTypes.object.isRequired,
	onClose: PropTypes.func,
	onCreateOrUpdateStory: PropTypes.func,
	setTitle: PropTypes.func.isRequired,
	setDescription: PropTypes.func.isRequired,
	setCategories: PropTypes.func.isRequired,
	setLanguage: PropTypes.func.isRequired,
	setImage: PropTypes.func.isRequired,
};
