import React, {useState} from 'react';
import {DropdownItem} from 'reactstrap';
import {useDispatch} from 'react-redux';
import {useHistory} from 'react-router-dom';

import {editStory} from 'lib/routes';

import {deleteStory} from 'redux/story';

import ConfirmModal from 'components/widgets/modals/Modal';
import DropdownButton from 'components/widgets/button/DropdownButton';

import './StoryDropdownButton.scss';

const CLASS = 'st-StoryDropdownButton';

export default function StoryDropdownButton({story}) {
	const dispatch = useDispatch();
	const history = useHistory();

	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleDeleteStory = () => {
		dispatch(deleteStory(story.id, history));
	};

	const toggleModal = () => setIsModalOpen(prevState => !prevState);

	const renderContent = () => (
		<span>
			Are you sure you want to delete <strong>{story.title}</strong>?
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
				<DropdownItem href={editStory(story.id, pageId)}>Edit</DropdownItem>
				<DropdownItem divider />
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
