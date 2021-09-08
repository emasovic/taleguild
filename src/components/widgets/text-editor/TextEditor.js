import React, {useCallback, useMemo} from 'react';
import {Slate, Editable, withReact} from 'slate-react';
import {createEditor} from 'slate';
import {withHistory} from 'slate-history';
import PropTypes from 'prop-types';

import HoveringToolbar from './widgets/HoveringToolbar';
import Element from './widgets/Element';
import Leaf from './widgets/Leaf';

import './TextEditor.scss';

const CLASS = 'st-TextEditor';
export default function TextEditor({value, onChange, onKeyDown, onKeyUp, pageId}) {
	const renderElement = useCallback(props => <Element {...props} />, []);
	const renderLeaf = useCallback(props => <Leaf {...props} />, []);
	const editor = useMemo(() => withHistory(withReact(createEditor())), []);

	return (
		<Slate editor={editor} value={value} onChange={onChange}>
			<HoveringToolbar className={CLASS} />
			<Editable
				onKeyDown={onKeyDown}
				onKeyUp={onKeyUp}
				className={CLASS}
				renderElement={renderElement}
				renderLeaf={renderLeaf}
				placeholder="Behind the seven seas…"
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
	pageId: PropTypes.number,
};

TextEditor.defaultProps = {
	onChange: () => {},
	onKeyDown: () => {},
};
