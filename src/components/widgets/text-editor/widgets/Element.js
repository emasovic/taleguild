import React from 'react';
import PropTypes from 'prop-types';

export default function Element({attributes, children, element}) {
	switch (element.type) {
		case 'block-quote':
			return <blockquote {...attributes}>{children}</blockquote>;
		case 'bulleted-list':
			return <ul {...attributes}>{children}</ul>;
		case 'heading-one':
			return <h1 {...attributes}>{children}</h1>;
		case 'heading-four':
			return <h4 {...attributes}>{children}</h4>;
		case 'list-item':
			return <li {...attributes}>{children}</li>;
		case 'numbered-list':
			return <ol {...attributes}>{children}</ol>;
		default:
			return <p {...attributes}>{children}</p>;
	}
}

Element.propTypes = {
	attributes: PropTypes.object,
	children: PropTypes.any,
	element: PropTypes.object,
};
