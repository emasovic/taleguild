import React, {useState, useEffect, useCallback} from 'react';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import debounce from 'lodash/debounce';
import {DropdownItem} from 'reactstrap';

import {Toast} from 'types/toast';
import {COLOR} from 'types/button';
import {STORY_OP} from 'types/story';
import {TYPOGRAPHY_LATO} from 'types/typography';
import FA from 'types/font_awesome';

import {selectUser} from 'redux/user';
import {addToast} from 'redux/toast';

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
	const dispatch = useDispatch();

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

	const validate = () => {
		const errors = [];

		title.length <= 3 && errors.push('Title too short. \n');
		!categories.length && errors.push('You didnt pick category.');
		categories.length > 3 && errors.push('You can pick maximum 3 categories.');
		!language && errors.push('You didnt pick language.');
		description.length <= 3 && errors.push('Description too short. \n');
		description.length >= 200 && errors.push('Description too long. \n');

		if (errors.length) {
			return dispatch(addToast(Toast.error(errors)));
		}

		return true;
	};

	const create = () => {
		if (validate()) {
			const payload = {
				id: story && story.id,
				title,
				published: true,
				image: image && image.id,
				user: data && data.id,
				description,
				categories: categories.length && categories.map(item => item.value),
				language: language && language.value,
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

	const _onCreateOrUpdateStory = useCallback(
		debounce((id, title) => onCreateOrUpdateStory({id, title}, false), 3000),
		[]
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
			<>
				<FloatingInput
					placeholder="Type title of your story here..."
					label="Title of story"
					value={title}
					onChange={val => setTitle(val)}
				/>
				<CategoryPicker
					placeholder="Pick categories"
					label="Categories"
					isMulti
					onChange={setCategories}
					value={categories}
				/>
				<LanguagePicker
					placeholder="Pick language"
					label="Language"
					onChange={setLanguage}
					value={language}
				/>
				<FloatingInput
					rows={5}
					label="Story description"
					type="textarea"
					value={description}
					placeholder="Type description of your story here..."
					onChange={val => setDescription(val)}
				/>
				<Uploader
					onUploaded={setImage}
					uploadlabel="Upload cover image"
					onRemove={() => setImage(null)}
					files={image}
				/>
			</>
		);
	};

	useEffect(() => {
		if (story) {
			setTitle(story.title || '');
			setDescription(story.description || '');
			setCategories(
				story.categories.map(item => ({label: item.display_name, value: item.id}))
			);
			setImage(story.image);
			setPublished(story.published || false);
			story.language && setLanguage({value: story.language.id, label: story.language.name});
		}
	}, [story]);

	useEffect(() => {
		if (published) {
			onCreateOrUpdateStory({id: story && story.id, published: false}, false);
		}
	}, [onCreateOrUpdateStory, story, published]);

	if (!story) {
		return <Loader />;
	}

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
							disabled={op === STORY_OP.saving_storypage}
							outline
							onClick={togglePreviewStoryModal}
							color={COLOR.secondary}
						/>
						<DropdownButton outline={true}>
							<DropdownItem
								disabled={op === STORY_OP.saving_storypage}
								onClick={() => onStoryPage(currentEditing.id, currentEditing.text)}
							>
								Update page
							</DropdownItem>
							<DropdownItem
								disabled={op === STORY_OP.saving_storypage || pages.length === 1}
								onClick={toggleDeleteStoryPageModal}
							>
								Delete page
							</DropdownItem>
							<DropdownItem
								disabled={op === STORY_OP.saving_storypage}
								onClick={toggleDeleteStoryModal}
							>
								Delete story
							</DropdownItem>
						</DropdownButton>
						{op === STORY_OP.saving_storypage && <span>Saving...</span>}
					</div>
				</div>

				<div>
					<IconButton
						color={COLOR.secondary}
						disabled={op === STORY_OP.saving_storypage}
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
					onSubmit={create}
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
				/>
			)}
		</div>
	);
}
