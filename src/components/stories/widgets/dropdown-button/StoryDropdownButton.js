import React, {useState, useCallback} from 'react';
import {DropdownItem} from 'reactstrap';
import {useDispatch} from 'react-redux';
import {useHistory} from 'react-router-dom';

import {editStory} from 'lib/routes';

import {TYPOGRAPHY_LATO} from 'types/typography';

import {deleteStory} from 'redux/story';

import ConfirmModal from 'components/widgets/modals/Modal';
import DropdownButton from 'components/widgets/button/DropdownButton';

import './StoryDropdownButton.scss';

const CLASS = 'st-StoryDropdownButton';

export default function StoryDropdownButton({story, onDeleteStory}) {
	const dispatch = useDispatch();
	const history = useHistory();

	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleDeleteStory = () => {
		if (onDeleteStory) {
			return onDeleteStory(story.id, story.favouriteId);
		}

		return _handleDeleteStory();
	};

	const _handleDeleteStory = useCallback(() => {
		dispatch(deleteStory(story.id, history));
	}, [dispatch, story, history]);

	const toggleModal = () => setIsModalOpen(prevState => !prevState);

	const renderContent = () => (
		<span className={TYPOGRAPHY_LATO.placeholder_grey_medium}>
			Are you sure you want to delete <strong>{story.title || 'Untitled'}</strong>?
		</span>
	);

	if (!story) {
		return null;
	}

	const {storypages} = story;

	const pageId = storypages && storypages.length ? storypages[0].id : null;

	return (
		<div className={CLASS}>
			<DropdownButton>
				{pageId && <DropdownItem href={editStory(story.id, pageId)}>Edit</DropdownItem>}

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
