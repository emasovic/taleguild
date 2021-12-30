import React from 'react';
import PropTypes from 'prop-types';

import ConfirmModal from 'components/widgets/modals/Modal';

import StoryItem from '../StoryItem';

function PreviewStoryDialog({isOpen, className, onClose, onSubmit, story}) {
	const renderPreviewContent = () => {
		const {id, title, description, image, slug, user} = story;
		return (
			<StoryItem
				id={id}
				image={image}
				description={description}
				title={title}
				author={user}
				slug={slug}
				storypages={[]}
			/>
		);
	};

	return (
		isOpen && (
			<ConfirmModal
				isOpen={isOpen}
				onClose={onClose}
				onSubmit={onSubmit}
				content={renderPreviewContent()}
				title="Preview"
				renderFooter
				cancelLabel="Back to edit"
				confirmLabel="Publish my story"
				className={className}
			/>
		)
	);
}

PreviewStoryDialog.propTypes = {
	isOpen: PropTypes.bool,
	className: PropTypes.string,
	onClose: PropTypes.func,
	onSubmit: PropTypes.func,
	story: PropTypes.object.isRequired,
};

export default PreviewStoryDialog;
