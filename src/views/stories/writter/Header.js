import React, {useState, useEffect, useMemo} from 'react';
import {Form} from 'reactstrap';
import {useSelector, shallowEqual} from 'react-redux';
import debounce from 'lodash.debounce';
import {DropdownItem} from 'reactstrap';
import PropTypes from 'prop-types';

import {COLOR} from 'types/button';
import {STORY_PAGE_OP} from 'types/story_page';
import {TYPOGRAPHY_LATO} from 'types/typography';
import FA from 'types/font_awesome';

import {selectUser} from 'redux/user';

import CategoryPicker from 'components/widgets/pickers/category/CategoryPicker';
import DropdownButton from 'components/widgets/button/DropdownButton';
import FloatingInput from 'components/widgets/input/FloatingInput';
import IconButton from 'components/widgets/button/IconButton';
import Uploader from 'components/widgets/uploader/Uploader';
import ConfirmModal from 'components/widgets/modals/Modal';
import Loader from 'components/widgets/loader/Loader';

import StoryPagePicker from '../widgets/page-picker/StoryPagePicker';
import StoryItem from '../StoryItem';
import LanguagePicker from 'components/widgets/pickers/language/LanguagePicker';

const ERRORS = {
	TITLE: 'TITLE',
	CATEGORIES: 'CATEGORIES',
	DESCRIPTION: 'DESCRIPTION',
	LANGUAGE: 'LANGUAGE',
};

export default function Header({
	className,
	pages,
	op,
	currentEditing,
	selectedPage,
	onSelectedPage,
	onPageRemove,
	onStoryPage,
	onStoryRemove,
	onCreateOrUpdateStory,
	story,
}) {
	const {user} = useSelector(
		state => ({
			user: selectUser(state),
		}),
		shallowEqual
	);

	const {data} = user;

	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [categories, setCategories] = useState([]);
	const [language, setLanguage] = useState(null);
	const [image, setImage] = useState(null);
	const [published, setPublished] = useState(false);
	const [isPublishStoryOpen, setIsPublishStoryOpen] = useState(false);
	const [isDeleteStoryOpen, setIsDeleteStoryOpen] = useState(false);
	const [isDeleteStoryPageOpen, setIsDeleteStoryPageOpen] = useState(false);
	const [isPreviewStoryOpen, setIsPreviewStoryOpen] = useState(false);
	const [errors, setErrors] = useState({});

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
				id: story && story.id,
				title,
				image: image && image.id,
				user: data && data.id,
				description,
				categories: categories.length && categories.map(item => item.value),
				language: language && language.value,
				published_at: !published ? new Date() : undefined,
			};
			onCreateOrUpdateStory(payload);
		}
	};

	const toggleDeleteStoryModal = () => setIsDeleteStoryOpen(prevState => !prevState);
	const toggleDeleteStoryPageModal = () => setIsDeleteStoryPageOpen(prevState => !prevState);
	const togglePublishStoryModal = () => setIsPublishStoryOpen(prevState => !prevState);
	const togglePreviewStoryModal = () => setIsPreviewStoryOpen(prevState => !prevState);

	const handlePageRemove = () => {
		toggleDeleteStoryPageModal();
		onPageRemove();
	};

	const _onCreateOrUpdateStory = useMemo(
		() => debounce((id, title) => onCreateOrUpdateStory({id, title}, false), 3000),
		[onCreateOrUpdateStory]
	);

	const handleTitle = val => {
		setTitle(val);
		!isPublishStoryOpen && !published && _onCreateOrUpdateStory(story.id, val);
	};

	const renderPreviewContent = () => {
		return (
			<StoryItem
				id={story.id}
				image={image}
				description={description}
				title={title}
				author={data}
				storypages={pages}
			/>
		);
	};

	const renderDetelePageContent = () => (
		<span className={TYPOGRAPHY_LATO.placeholder_grey_medium}>
			Are you sure you want to delete <strong>Page {selectedPage + 1}</strong>?
		</span>
	);

	const renderDeteleContent = () => (
		<span className={TYPOGRAPHY_LATO.placeholder_grey_medium}>
			Are you sure you want to delete <strong>{title || 'this story'}</strong>?
		</span>
	);

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

	useEffect(() => {
		if (story) {
			story.title && setTitle(story.title);
			story.description && setDescription(story.description);
			setCategories(
				story.categories.map(item => ({label: item.display_name, value: item.id}))
			);
			setImage(story.image);
			setPublished(story.published_at);
			story.language && setLanguage({value: story.language.id, label: story.language.name});
		}
	}, [story]);

	if (!story) {
		return <Loader />;
	}

	const disabledActions = op === STORY_PAGE_OP.create || op === STORY_PAGE_OP.update;

	return (
		<div className={className + '-header'}>
			<FloatingInput
				placeholder="Type title of your story here..."
				value={title}
				onChange={val => handleTitle(val)}
			/>
			<div className={className + '-header-publish'}>
				<div className={className + '-header-publish-actions'}>
					<StoryPagePicker
						pages={pages}
						onChange={item => onSelectedPage(item.value)}
						onNewPageClick={() => onStoryPage(undefined)}
						value={selectedPage}
					/>
					<div className={className + '-header-publish-actions-buttons'}>
						<IconButton
							icon={FA.solid_eye}
							disabled={disabledActions}
							outline
							onClick={togglePreviewStoryModal}
							color={COLOR.secondary}
						/>
						<DropdownButton outline={true}>
							<DropdownItem
								disabled={disabledActions}
								onClick={() => onStoryPage(currentEditing.id, currentEditing.text)}
							>
								Update page
							</DropdownItem>
							<DropdownItem
								disabled={disabledActions || pages.length === 1}
								onClick={toggleDeleteStoryPageModal}
							>
								Delete page
							</DropdownItem>
							<DropdownItem
								disabled={disabledActions}
								onClick={toggleDeleteStoryModal}
							>
								Delete story
							</DropdownItem>
						</DropdownButton>
						{disabledActions && <span>Saving...</span>}
					</div>
				</div>

				<div>
					<IconButton
						color={COLOR.secondary}
						disabled={op === STORY_PAGE_OP.save}
						onClick={togglePublishStoryModal}
					>
						Publish
					</IconButton>
				</div>
			</div>

			{isDeleteStoryPageOpen && (
				<ConfirmModal
					isOpen={isDeleteStoryPageOpen}
					renderFooter
					title="Delete"
					content={renderDetelePageContent()}
					onClose={toggleDeleteStoryPageModal}
					onSubmit={handlePageRemove}
				/>
			)}

			{isDeleteStoryOpen && (
				<ConfirmModal
					isOpen={isDeleteStoryOpen}
					renderFooter
					title="Delete"
					content={renderDeteleContent()}
					onClose={toggleDeleteStoryModal}
					onSubmit={onStoryRemove}
				/>
			)}

			{isPreviewStoryOpen && (
				<ConfirmModal
					isOpen={isPreviewStoryOpen}
					onClose={togglePreviewStoryModal}
					onSubmit={() => {
						togglePublishStoryModal();
						togglePreviewStoryModal();
					}}
					content={renderPreviewContent()}
					title="Preview"
					renderFooter
					cancelLabel="Back to edit"
					confirmLabel="Publish my story"
					className={className + '-header-previewModal'}
				/>
			)}

			{isPublishStoryOpen && (
				<ConfirmModal
					isOpen={isPublishStoryOpen}
					onClose={togglePublishStoryModal}
					onSubmit={create}
					content={renderContent()}
					title="Publishing"
					renderFooter
					cancelLabel="Back to edit"
					confirmLabel="Publish my story"
					className={className + '-header-publishModal'}
				/>
			)}
		</div>
	);
}

Header.propTypes = {
	className: PropTypes.string,
	pages: PropTypes.array,
	op: PropTypes.string,
	currentEditing: PropTypes.object,
	selectedPage: PropTypes.number,
	onSelectedPage: PropTypes.func,
	onPageRemove: PropTypes.func,
	onStoryPage: PropTypes.func,
	onStoryRemove: PropTypes.func,
	onCreateOrUpdateStory: PropTypes.func,
	story: PropTypes.object,
};
