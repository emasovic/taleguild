import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
// import {useParams} from 'react-router-dom';
import {DropdownItem} from 'reactstrap';

import {Toast} from 'types/toast';
import {COLOR} from 'types/button';
import {STORY_OP} from 'types/story';
import FA from 'types/font_awesome';

// import {selectStory} from 'redux/story';
import {selectUser} from 'redux/user';
import {addToast} from 'redux/toast';

import CategoryPicker from 'components/widgets/pickers/category/CategoryPicker';
import DropdownButton from 'components/widgets/button/DropdownButton';
import FloatingInput from 'components/widgets/input/FloatingInput';
import IconButton from 'components/widgets/button/IconButton';
import Uploader from 'components/widgets/uploader/Uploader';
import ConfirmModal from 'components/widgets/modals/Modal';
import Loader from 'components/widgets/loader/Loader';

import StoryPagePicker from '../widgets/StoryPagePicker';
import StoryItem from '../StoryItem';
import {useDebounce} from 'hooks/debounce';

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
	const [category, setCategory] = useState([]);
	const [image, setImage] = useState(null);
	// const [published, setPublished] = useState(false);
	const [isPublishStoryOpen, setIsPublishStoryOpen] = useState(false);
	const [isDeleteStoryOpen, setIsDeleteStoryOpen] = useState(false);
	const [isDeleteStoryPageOpen, setIsDeleteStoryPageOpen] = useState(false);
	const [isPreviewStoryOpen, setIsPreviewStoryOpen] = useState(false);

	const text = story && !story.published && title;
	const debouncedSearchTerm = useDebounce(text, 3000);

	const validate = () => {
		const errors = [];

		title.length <= 3 && errors.push('Title too short! \n');
		!category.length && errors.push('You must select category!');
		category.length > 3 && errors.push('You can select maximum 3 categories!');
		description.length <= 3 && errors.push('Description too short! \n');
		description.length >= 200 && errors.push('Description too long! \n');

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
				categories: category.length && category.map(item => item.value),
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

	useEffect(() => {
		if (debouncedSearchTerm) {
			onCreateOrUpdateStory({id: story && story.id, title}, false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedSearchTerm]);

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
		<span>
			Are you sure you want to delete <strong>Page {selectedPage + 1}</strong>?
		</span>
	);

	const renderDeteleContent = () => (
		<span>
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
					onChange={setCategory}
					value={category}
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
			setCategory(story.categories.map(item => ({label: item.name, value: item.id})));
			setImage(story.image);
			// setPublished(story.published || false);
		}
	}, [story]);

	if (!story) {
		return <Loader />;
	}

	return (
		<div className={className + '-header'}>
			<FloatingInput
				placeholder="Type title of your story here..."
				value={title}
				onChange={val => setTitle(val)}
			/>
			<div className={className + '-header-publish'}>
				<div className={className + '-header-publish-actions'}>
					<StoryPagePicker
						pages={pages}
						onChange={val => onSelectedPage(val.index)}
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
							<DropdownItem divider />
							<DropdownItem
								disabled={op === STORY_OP.saving_storypage || pages.length === 1}
								onClick={toggleDeleteStoryPageModal}
							>
								Delete page
							</DropdownItem>
							<DropdownItem divider />
							<DropdownItem
								disabled={op === STORY_OP.saving_storypage}
								onClick={toggleDeleteStoryModal}
							>
								Delete story
							</DropdownItem>
						</DropdownButton>
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
