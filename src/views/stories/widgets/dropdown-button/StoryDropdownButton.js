import React, {useState, useCallback} from 'react';
import {DropdownItem} from 'reactstrap';
import {useDispatch} from 'react-redux';
import PropTypes from 'prop-types';

import {editStory} from 'lib/routes';

import {FONTS, TYPOGRAPHY_VARIANTS} from 'types/typography';

import {deleteStory} from 'redux/story';
import {updateArchivedStory} from 'redux/archivedStories';

import ConfirmModal from 'components/widgets/modals/Modal';
import DropdownButton from 'components/widgets/button/DropdownButton';
import Typography from 'components/widgets/typography/Typography';

import './StoryDropdownButton.scss';

const CLASS = 'st-StoryDropdownButton';

export default function StoryDropdownButton({story, onDeleteStory, displayArchived, keepArchived}) {
	const dispatch = useDispatch();

	const {archivedAt, id, favouriteId, title} = story;

	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleDeleteStory = () => {
		if (onDeleteStory) {
			return onDeleteStory(id, favouriteId);
		}

		return _handleDeleteStory();
	};

	const _handleDeleteStory = useCallback(() => {
		dispatch(deleteStory(id));
	}, [dispatch, id]);

	const handleArchive = () => {
		dispatch(
			updateArchivedStory({id, archived_at: archivedAt ? null : new Date()}, keepArchived)
		);
	};

	const toggleModal = () => setIsModalOpen(prevState => !prevState);

	const renderContent = () => (
		<Typography font={FONTS.lato} variant={TYPOGRAPHY_VARIANTS.p14}>
			Are you sure you want to delete <strong>{title || 'Untitled'}</strong>?
		</Typography>
	);

	if (!story) {
		return null;
	}

	const {storypages} = story;
	const pageId = storypages?.length ? storypages[0].id : null;
	const archiveTitle = archivedAt ? 'Show on profile' : 'Archive';

	return (
		<div className={CLASS}>
			<DropdownButton>
				{pageId && <DropdownItem href={editStory(id, pageId)}>Edit</DropdownItem>}
				{displayArchived && (
					<DropdownItem onClick={handleArchive}>{archiveTitle}</DropdownItem>
				)}
				<DropdownItem onClick={toggleModal}>Delete</DropdownItem>
			</DropdownButton>

			{isModalOpen && (
				<ConfirmModal
					isOpen={isModalOpen}
					renderFooter
					title="Delete"
					cancelLabel="Cancel"
					confirmLabel="Delete"
					content={renderContent()}
					onClose={toggleModal}
					onSubmit={handleDeleteStory}
				/>
			)}
		</div>
	);
}

StoryDropdownButton.propTypes = {
	story: PropTypes.object,
	displayArchived: PropTypes.bool,
	keepArchived: PropTypes.bool,
	onDeleteStory: PropTypes.func,
};
