import React from 'react';

export default function Element({attributes, children, element}) {
	switch (element.type) {
		case 'block-quote':
			return <blockquote {...attributes}>{children}</blockquote>;
		case 'bulleted-list':
			return <ul {...attributes}>{children}</ul>;
		case 'heading-one':
			return <h1 {...attributes}>{children}</h1>;
		case 'heading-three':
			return <h3 {...attributes}>{children}</h3>;
		case 'list-item':
			return <li {...attributes}>{children}</li>;
		case 'numbered-list':
			return <ol {...attributes}>{children}</ol>;
		default:
			return <p {...attributes}>{children}</p>;
	}
}