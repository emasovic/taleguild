import React from 'react';
import PropTypes from 'prop-types';
import {Modal, ModalBody, ModalHeader, ModalFooter} from 'reactstrap';

import {COLOR} from 'types/button';

import IconButton from '../button/IconButton';

import './Modal.scss';

const CLASS = 'st-Modal';

export default function ConfirmModal({
	onSubmit,
	onClose,
	title,
	content,
	renderFooter,
	cancelLabel,
	confirmLabel,
	isOpen,
}) {
	const handleConfirm = () => {
		onSubmit && onSubmit();
	};

	const handleCancel = () => {
		onClose && onClose();
	};

	const renderModalHeader = () => {
		if (!title) {
			return null;
		}

		return <ModalHeader toggle={handleCancel}>{title}</ModalHeader>;
	};

	const renderModalBody = () => {
		if (!content) {
			return null;
		}

		return <ModalBody>{content}</ModalBody>;
	};

	const renderModalFooter = () => {
		return (
			<ModalFooter>
				<IconButton color={COLOR.secondary} onClick={handleCancel}>
					{cancelLabel}
				</IconButton>
				<IconButton onClick={handleConfirm}>{confirmLabel}</IconButton>
			</ModalFooter>
		);
	};

	return (
		<Modal
			returnFocusAfterClose={true}
			toggle={handleCancel}
			isOpen={isOpen}
			modalClassName={CLASS}
		>
			{renderModalHeader()}
			{renderModalBody()}
			{renderFooter && renderModalFooter()}
		</Modal>
	);
}

ConfirmModal.propTypes = {
	title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
	content: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
	className: PropTypes.string,
	onSubmit: PropTypes.func,
	onClose: PropTypes.func,
	confirmLabel: PropTypes.string,
	cancelLabel: PropTypes.string,
	renderFooter: PropTypes.bool,
};

ConfirmModal.defaultProps = {
	confirmLabel: 'Yes',
	cancelLabel: 'No',
	className: '',
	renderFooter: true,
};
