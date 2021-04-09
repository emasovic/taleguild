import React, {useCallback, useMemo} from 'react';
import {Slate, Editable, withReact} from 'slate-react';
import {createEditor} from 'slate';
import {withHistory} from 'slate-history';
import PropTypes from 'prop-types';

import Element from './widgets/Element';
import Leaf from './widgets/Leaf';

import './TextViewer.scss';

const CLASS = 'st-TextViewer';

export default function TextViewer({value}) {
	const renderElement = useCallback(props => <Element {...props} />, []);
	const renderLeaf = useCallback(props => <Leaf {...props} />, []);
	const editor = useMemo(() => withHistory(withReact(createEditor())), []);

	return (
		<Slate editor={editor} value={value} onChange={() => {}}>
			<Editable
				readOnly
				className={CLASS}
				renderElement={renderElement}
				renderLeaf={renderLeaf}
				spellCheck
				autoFocus
			/>
		</Slate>
	);
}

TextViewer.propTypes = {
	value: PropTypes.array,
};
