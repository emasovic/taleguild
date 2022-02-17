import React, {useCallback, useMemo} from 'react';
import {Slate, Editable, withReact} from 'slate-react';
import {createEditor} from 'slate';
import {withHistory} from 'slate-history';
import PropTypes from 'prop-types';

import Element from './widgets/Element';
import Leaf from './widgets/Leaf';
import Toolbar from './widgets/Toolbar';

import './TextEditor.scss';

const CLASS = 'st-TextEditor';
export default function TextEditor({value, onChange, onKeyDown, onKeyUp, onFocus, onBlur}) {
	const renderElement = useCallback(props => <Element {...props} />, []);
	const renderLeaf = useCallback(props => <Leaf {...props} />, []);
	const editor = useMemo(() => withHistory(withReact(createEditor())), []);
	editor.children = value;
	return (
		<Slate editor={editor} value={value} onChange={onChange}>
			<Toolbar className={CLASS} value={value} />
			<Editable
				onKeyDown={onKeyDown}
				onKeyUp={onKeyUp}
				onFocus={onFocus}
				onBlur={onBlur}
				className={CLASS}
				renderElement={renderElement}
				renderLeaf={renderLeaf}
				placeholder="Write for 3 minutes and more to get coins and start focus mode…"
				spellCheck
				autoFocus
			/>
		</Slate>
	);
}

TextEditor.propTypes = {
	value: PropTypes.array,
	onChange: PropTypes.func.isRequired,
	onKeyDown: PropTypes.func.isRequired,
	onKeyUp: PropTypes.func.isRequired,
	onFocus: PropTypes.func.isRequired,
	onBlur: PropTypes.func.isRequired,
};

TextEditor.defaultProps = {
	onChange: () => {},
	onKeyDown: () => {},
	onFocus: () => {},
	onBlur: () => {},
};
