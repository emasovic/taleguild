import React from 'react';

import ReactQuill from 'react-quill';

import './TextEditor.scss';

const CLASS = 'st-TextEditor';

export default function TextEditor(props) {
	const {value, onChange} = props;
	return (
		<div className={CLASS}>
			<ReactQuill
				value={value}
				onChange={onChange}
				modules={TextEditor.modules}
				formats={TextEditor.formats}
				// preserveWhitespace={true}
				{...props}
			/>
		</div>
	);
}

TextEditor.modules = {
	toolbar: {
		container: [
			[{header: []}],
			// [{font: []}],
			// [{size: SIZES_WHITELIST}],
			['bold', 'italic', 'underline', {color: []}], // toggled buttons
			[{align: []}],
			[{list: 'ordered'}, {list: 'bullet'}],
			[{indent: '-1'}, {indent: '+1'}], // outdent/indent

			// ['blockquote', 'code-block'],
			// [{header: 1}, {header: 2}], // custom button values
			// [{script: 'sub'}, {script: 'super'}], // superscript/subscript
			// [{direction: 'rtl'}], // text direction
			// [{color: []}, {background: []}], // dropdown with defaults from theme
			// ['clean'], // remove formatting button
		],
	},
};

TextEditor.formats = [
	'header',
	'font',
	'size',
	'bold',
	'italic',
	'underline',
	'strike',
	'blockquote',
	'ordered',
	'list',
	'bullet',
	'indent',
	'link',
	// 'image',
	// 'video',
	'color',
	'align',
	'background',
	'direction',
	'code-block',
];
