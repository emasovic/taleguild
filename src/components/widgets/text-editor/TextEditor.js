import React, {useCallback, useMemo, useState} from 'react';
import {Slate, Editable, withReact} from 'slate-react';
import {createEditor} from 'slate';
import {withHistory} from 'slate-history';
import isHotkey from 'is-hotkey';
import PropTypes from 'prop-types';

import Element from './widgets/Element';
import Leaf from './widgets/Leaf';
import Toolbar from './widgets/Toolbar';
import {toggleFormat} from './widgets/Buttons';

import './TextEditor.scss';

const CLASS = 'st-TextEditor';

const HOTKEYS = {
	'mod+b': 'bold',
	'mod+i': 'italic',
	'mod+u': 'underline',
};

export default function TextEditor({initialValue, onChange, onKeyDown, onKeyUp, onFocus, onBlur}) {
	const [value, setValue] = useState(initialValue);

	const renderLeaf = useCallback(props => <Leaf {...props} />, []);

	const renderElement = useCallback(props => <Element {...props} />, []);

	const editor = useMemo(() => withHistory(withReact(createEditor())), []);

	const handleChange = val => {
		setValue(val);
		onChange(val);
	};

	const handleKeyDown = e => {
		for (const hotkey in HOTKEYS) {
			if (isHotkey(hotkey, e)) {
				e.preventDefault();
				const mark = HOTKEYS[hotkey];
				toggleFormat(editor, mark);
			}
		}
		onKeyDown && onKeyDown();
	};
	return (
		<Slate editor={editor} value={value} onChange={handleChange}>
			<Toolbar className={CLASS} value={value} />
			<Editable
				onKeyDown={handleKeyDown}
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
	initialValue: PropTypes.array.isRequired,
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
