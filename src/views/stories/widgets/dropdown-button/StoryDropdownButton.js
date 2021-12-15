import React, {useState, useCallback} from 'react';
import {DropdownItem} from 'reactstrap';
import {useDispatch, useSelector} from 'react-redux';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';

import {editStory} from 'lib/routes';
import {isMobile} from 'lib/util';

import {FONTS, TYPOGRAPHY_VARIANTS} from 'types/typography';

import {selectAuthUser} from 'redux/auth';
import {updateArchivedStory} from 'redux/archivedStories';
import {deleteStory, selectStory} from 'redux/story';

import ConfirmModal from 'components/widgets/modals/Modal';
import DropdownButton from 'components/widgets/button/DropdownButton';
import Typography from 'components/widgets/typography/Typography';

import './StoryDropdownButton.scss';

const CLASS = 'st-StoryDropdownButton';

export default function StoryDropdownButton({id, selector, onDeleteStory, keepArchived}) {
	const dispatch = useDispatch();
	const {data} = useSelector(selectAuthUser);

	selector = selector || selectStory;

	const story = useSelector(state => selector(state, id));
	const {archived_at, published_at, title, storypages} = story || {};

	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleDeleteStory = () => {
		if (onDeleteStory) {
			return onDeleteStory(id);
		}

		return _handleDeleteStory();
	};

	const _handleDeleteStory = useCallback(() => {
		dispatch(deleteStory(id));
	}, [dispatch, id]);

	const handleArchive = () => {
		dispatch(
			updateArchivedStory(
				{id, user: data?.id, archived_at: archived_at ? null : new Date()},
				keepArchived
			)
		);
	};

	const toggleModal = () => setIsModalOpen(prevState => !prevState);

	const renderContent = () => (
		<Typography font={FONTS.lato} variant={TYPOGRAPHY_VARIANTS.action1}>
			Are you sure you want to delete <strong>{title || 'Untitled'}</strong>?
		</Typography>
	);

	if (!story) {
		return null;
	}

	const pageId = storypages?.length ? storypages[0].id : null;
	const archiveTitle = archived_at ? 'Unarchive' : 'Archive';

	const displayEdit = pageId && !isMobile && (archived_at || !published_at);
	const displayArchived = !!published_at;
	return (
		<div className={CLASS}>
			<DropdownButton>
				{displayEdit && (
					<DropdownItem tag={Link} to={editStory(id, pageId)}>
						Edit
					</DropdownItem>
				)}
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
	id: PropTypes.number.isRequired,
	selector: PropTypes.func,
	keepArchived: PropTypes.bool,
	onDeleteStory: PropTypes.func,
};
