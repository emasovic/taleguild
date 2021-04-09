import React from 'react';
import PropTypes from 'prop-types';

export default function Leaf({attributes, children, leaf}) {
	if (leaf.bold) {
		children = <strong>{children}</strong>;
	}

	if (leaf.code) {
		children = <code>{children}</code>;
	}

	if (leaf.italic) {
		children = <em>{children}</em>;
	}

	if (leaf.underline) {
		children = <u>{children}</u>;
	}

	return <span {...attributes}>{children}</span>;
}

Leaf.propTypes = {
	attributes: PropTypes.object,
	children: PropTypes.any,
	leaf: PropTypes.object,
};
