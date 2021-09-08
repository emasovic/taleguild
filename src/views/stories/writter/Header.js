import React, {useState, useEffect, useMemo, useCallback} from 'react';

import {useSelector, useDispatch} from 'react-redux';
import debounce from 'lodash.debounce';
import {DropdownItem} from 'reactstrap';
import PropTypes from 'prop-types';
import {useHistory} from 'react-router';

import {editStory} from 'lib/routes';

import {COLOR} from 'types/button';
import {STORY_PAGE_OP} from 'types/story_page';
import {FONTS, TYPOGRAPHY_VARIANTS} from 'types/typography';
import FA from 'types/font_awesome';

import {selectUser} from 'redux/user';
import {createOrUpdateStory, deleteStory} from 'redux/story';
import {deleteStoryPage} from 'redux/storyPages';

import DropdownButton from 'components/widgets/button/DropdownButton';
import FloatingInput from 'components/widgets/input/FloatingInput';
import IconButton from 'components/widgets/button/IconButton';

import ConfirmModal from 'components/widgets/modals/Modal';
import Typography from 'components/widgets/typography/Typography';

import StoryPagePicker from '../widgets/page-picker/StoryPagePicker';

import PublishStoryDialog from './PublishStoryDialog';
import PreviewStoryDialog from './PreviewStoryDialog';

export default function Header({
	className,
	pages,
	op,
	currentEditing,
	selectedPage,
	onStoryPage,
	story,
	pageId,
	storyId,
}) {
	const dispatch = useDispatch();

	const {data} = useSelector(selectUser);

	const {replace} = useHistory();

	const [isPublishStoryOpen, setIsPublishStoryOpen] = useState(false);
	const [isDeleteStoryOpen, setIsDeleteStoryOpen] = useState(false);
	const [isDeleteStoryPageOpen, setIsDeleteStoryPageOpen] = useState(false);
	const [isPreviewStoryOpen, setIsPreviewStoryOpen] = useState(false);
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [categories, setCategories] = useState([]);
	const [language, setLanguage] = useState(null);
	const [image, setImage] = useState(null);
	const [published, setPublished] = useState(false);

	const stateStory = {
		id: storyId,
		title,
		description,
		categories,
		language,
		image,
		published,
		storypages: story?.storypages,
		author: data,
	};

	const toggleDeleteStoryModal = () => setIsDeleteStoryOpen(prevState => !prevState);
	const toggleDeleteStoryPageModal = () => setIsDeleteStoryPageOpen(prevState => !prevState);
	const togglePublishStoryModal = () => setIsPublishStoryOpen(prevState => !prevState);
	const togglePreviewStoryModal = () => setIsPreviewStoryOpen(prevState => !prevState);

	const disabledActions = op === STORY_PAGE_OP.create || op === STORY_PAGE_OP.update;

	const handlePageRemove = () => {
		toggleDeleteStoryPageModal();
		handleRemovePage(story.id, pageId);
	};

	const handleCreateOrUpdateStory = useCallback(
		(payload, shouldChange) => {
			dispatch(createOrUpdateStory(payload, shouldChange));
		},
		[dispatch]
	);

	const handleRemovePage = (storyId, pageId) => dispatch(deleteStoryPage(storyId, pageId));

	const handleRemoveStory = () => dispatch(deleteStory(story.id));

	const _onCreateOrUpdateStory = useMemo(
		() =>
			debounce(
				({id, user, title}) => handleCreateOrUpdateStory({id, user, title}, false),
				3000
			),
		[handleCreateOrUpdateStory]
	);

	const handleTitle = val => {
		setTitle(val);
		!isPublishStoryOpen &&
			!story.published &&
			_onCreateOrUpdateStory({id: story.id, user: data?.id, title: val});
	};

	const renderDetelePageContent = () => (
		<Typography font={FONTS.lato} variant={TYPOGRAPHY_VARIANTS.p14}>
			Are you sure you want to delete <strong>Page {selectedPage + 1}</strong>?
		</Typography>
	);

	const renderDeteleContent = () => (
		<Typography font={FONTS.lato} variant={TYPOGRAPHY_VARIANTS.p14}>
			Are you sure you want to delete <strong>{title || 'this story'}</strong>?
		</Typography>
	);

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
						onChange={item => item.value && replace(editStory(storyId, item.value))}
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
					onSubmit={handleRemoveStory}
				/>
			)}

			{isPreviewStoryOpen && (
				<PreviewStoryDialog
					isOpen={isPreviewStoryOpen}
					onClose={togglePreviewStoryModal}
					onSubmit={() => {
						togglePublishStoryModal();
						togglePreviewStoryModal();
					}}
					className={className + '-header-previewModal'}
					story={stateStory}
				/>
			)}

			{isPublishStoryOpen && (
				<PublishStoryDialog
					onCreateOrUpdateStory={handleCreateOrUpdateStory}
					isOpen={isPublishStoryOpen}
					onClose={togglePublishStoryModal}
					className={className + '-header-publishModal'}
					story={stateStory}
					setTitle={setTitle}
					setDescription={setDescription}
					setCategories={setCategories}
					setLanguage={setLanguage}
					setImage={setImage}
				/>
			)}
		</div>
	);
}

Header.propTypes = {
	className: PropTypes.string.isRequired,
	pages: PropTypes.array.isRequired,
	op: PropTypes.string,
	currentEditing: PropTypes.object.isRequired,
	selectedPage: PropTypes.number.isRequired,
	onStoryPage: PropTypes.func.isRequired,
	pageId: PropTypes.string.isRequired,
	storyId: PropTypes.string.isRequired,
	story: PropTypes.object.isRequired,
};
