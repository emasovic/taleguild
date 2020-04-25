import React from 'react';

import ReactQuill from 'react-quill';

import './TextViewer.scss';

const CLASS = 'st-TextViewer';

function TextViewer(value) {
	return (
		<div className={CLASS}>
			<div className="text-editor">
				<ReactQuill
					value={value}
					readOnly={true}
					modules={TextViewer.modules}
					preserveWhitespace={true}
				/>
			</div>
		</div>
	);
}

TextViewer.modules = {
	toolbar: false,
};

export default TextViewer;
