import React, {useState, useMemo, useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import debounce from 'lodash.debounce';
import {DropdownItem} from 'reactstrap';
import PropTypes from 'prop-types';
import {useHistory} from 'react-router';
import {mixed, object, string, array} from 'yup';
import {useFormik} from 'formik';

import {editStory} from 'lib/routes';

import {STORY_PAGE_OP} from 'types/story_page';
import {FONTS, TEXT_COLORS, TYPOGRAPHY_VARIANTS} from 'types/typography';

import {selectAuthUser} from 'redux/auth';
import {createOrUpdateStory, deleteStory} from 'redux/story';
import {deleteStoryPage} from 'redux/storyPages';

import DropdownButton from 'components/widgets/button/DropdownButton';
import FloatingInput from 'components/widgets/input/FloatingInput';
import ConfirmModal from 'components/widgets/modals/Modal';
import Typography from 'components/widgets/typography/Typography';
import IconButton from 'components/widgets/button/IconButton';

import StoryPagePicker from '../widgets/page-picker/StoryPagePicker';

import PublishStoryDialog from './PublishStoryDialog';
import FA from 'types/font_awesome';

const validationSchema = object().shape({
	title: string()
		.min(2, 'Too Short!')
		.max(50, 'Too Long!')
		.required('Required'),
	description: string()
		.min(2, 'Too Short!')
		.max(250, 'Too Long!')
		.required('Required'),
	categories: array()
		.required(`You didn't pick category`)
		.min(1, 'Required')
		.max(3, 'You can pick maximum 3 categories.'),
	language: mixed().required(`You didn't pick language.`),
});

export default function Header({className, pages, op, onStoryPage, story, pageId, storyId}) {
	const dispatch = useDispatch();

	const {data} = useSelector(selectAuthUser);

	const {replace} = useHistory();

	const [isPublishStoryOpen, setIsPublishStoryOpen] = useState(false);
	const [isDeleteStoryOpen, setIsDeleteStoryOpen] = useState(false);
	const [isDeleteStoryPageOpen, setIsDeleteStoryPageOpen] = useState(false);

	const toggleDeleteStoryModal = () => setIsDeleteStoryOpen(prevState => !prevState);
	const toggleDeleteStoryPageModal = () => setIsDeleteStoryPageOpen(prevState => !prevState);
	const togglePublishStoryModal = () => setIsPublishStoryOpen(prevState => !prevState);

	const disabledActions = op[STORY_PAGE_OP.create].loading || op[STORY_PAGE_OP.update].loading;
	const savedIn = story?.archived_at ? 'Archived' : 'Drafts';
	const savingText = disabledActions
		? 'Saving...'
		: op[STORY_PAGE_OP.update].success
		? `Saved in ${savedIn}`
		: '';
	const selectedPage = pages.findIndex(item => item.id === Number(pageId));

	const handleSubmit = ({
		id,
		title,
		image,
		description,
		categories,
		user,
		language,
		published,
	}) => {
		const payload = {
			id,
			title,
			image: image && image.id,
			user: user?.id,
			description,
			categories: categories.length && categories.map(item => item.value),
			language: language && language.value,
			published_at: !published ? new Date() : undefined,
			archived_at: null,
		};

		handleCreateOrUpdateStory(payload);
	};

	const {
		values,
		errors,
		handleSubmit: formikSubmit,
		handleChange,
		resetForm,
		setFieldValue,
	} = useFormik({
		validationSchema,
		enableReinitialize: true,
		validateOnChange: false,
		initialValues: {
			id: story?.id,
			title: story?.title || '',
			user: story?.user || data,
			description: story?.description || '',
			categories: story?.categories.map(item => ({label: item.display_name, value: item.id})),
			language: story?.language && {value: story?.language?.id, label: story?.language?.name},
			image: story?.image,
			published: story?.published_at,
		},
		onSubmit: handleSubmit,
	});

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
		setFieldValue('title', val);
		!isPublishStoryOpen &&
			!values.published &&
			_onCreateOrUpdateStory({id: story.id, user: data?.id, title: val});
	};

	const renderDetelePageContent = () => (
		<Typography font={FONTS.lato} variant={TYPOGRAPHY_VARIANTS.action1}>
			Are you sure you want to delete <strong>Page {selectedPage + 1}</strong>?
		</Typography>
	);

	const renderDeteleContent = () => (
		<Typography font={FONTS.lato} variant={TYPOGRAPHY_VARIANTS.action1}>
			Are you sure you want to delete <strong>{values.title || 'this story'}</strong>?
		</Typography>
	);

	return (
		<div className={className + '-header'}>
			<FloatingInput
				placeholder="Type title of your story here..."
				value={values.title}
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
						<DropdownButton outline={true}>
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
					</div>
				</div>
				<div>
					<IconButton
						tertiary
						outline
						disabled={op[STORY_PAGE_OP.update].loading}
						onClick={togglePublishStoryModal}
					>
						Publish
					</IconButton>
				</div>
			</div>

			<div className={className + '-header-saving'}>
				<Typography color={TEXT_COLORS.tertiary}>{savingText}</Typography>
				<Typography color={TEXT_COLORS.tertiary} icon={FA.eye}>
					Only vissible to you
				</Typography>
			</div>

			{isDeleteStoryPageOpen && (
				<ConfirmModal
					isOpen={isDeleteStoryPageOpen}
					renderFooter
					title="Delete"
					cancelLabel="Cancel"
					confirmLabel="Delete"
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
					cancelLabel="Cancel"
					confirmLabel="Delete"
					content={renderDeteleContent()}
					onClose={toggleDeleteStoryModal}
					onSubmit={handleRemoveStory}
				/>
			)}

			{isPublishStoryOpen && (
				<PublishStoryDialog
					isOpen={isPublishStoryOpen}
					onClose={() => {
						togglePublishStoryModal();
						resetForm();
					}}
					className={className + '-header-publishModal'}
					onChange={handleChange}
					onFieldValue={setFieldValue}
					errors={errors}
					values={values}
					onSubmit={formikSubmit}
				/>
			)}
		</div>
	);
}

Header.propTypes = {
	className: PropTypes.string.isRequired,
	pages: PropTypes.array.isRequired,
	op: PropTypes.object,
	onStoryPage: PropTypes.func.isRequired,
	pageId: PropTypes.string.isRequired,
	storyId: PropTypes.string.isRequired,
	story: PropTypes.object.isRequired,
};
