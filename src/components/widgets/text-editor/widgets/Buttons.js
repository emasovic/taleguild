import React from 'react';
import {useSlate} from 'slate-react';
import {Editor, Transforms} from 'slate';
import PropTypes from 'prop-types';

import IconButton from 'components/widgets/button/IconButton';

const toggleBlock = (editor, format) => {
	const isActive = isBlockActive(editor, format);

	Transforms.setNodes(editor, {
		type: isActive ? 'paragraph' : format,
	});
};

export const toggleFormat = (editor, format) => {
	const isActive = isFormatActive(editor, format);

	if (isActive) {
		Editor.removeMark(editor, format);
	} else {
		Editor.addMark(editor, format, true);
	}
};

const isBlockActive = (editor, format) => {
	const [match] = Editor.nodes(editor, {
		match: n => n.type === format,
	});

	return !!match;
};

const isFormatActive = (editor, format) => {
	const marks = Editor.marks(editor);
	return marks ? marks[format] === true : false;
};

export const FormatButton = ({format, icon, ...rest}) => {
	const editor = useSlate();
	return (
		<IconButton
			active={isFormatActive(editor, format)}
			onMouseDown={event => {
				event.preventDefault();
				toggleFormat(editor, format);
			}}
			icon={icon}
			{...rest}
		/>
	);
};

FormatButton.propTypes = {
	format: PropTypes.any,
	icon: PropTypes.object,
};

export const BlockButton = ({format, icon, ...rest}) => {
	const editor = useSlate();
	return (
		<IconButton
			active={isBlockActive(editor, format)}
			onMouseDown={event => {
				event.preventDefault();
				toggleBlock(editor, format);
			}}
			icon={icon}
			{...rest}
		/>
	);
};

BlockButton.propTypes = {
	format: PropTypes.any,
	icon: PropTypes.object,
};
