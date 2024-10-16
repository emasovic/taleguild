import React, {useCallback, useEffect, useMemo} from 'react';
import {Slate, Editable, withReact} from 'slate-react';
import {createEditor} from 'slate';
import {withHistory} from 'slate-history';
import PropTypes from 'prop-types';

import {usePrevious} from 'hooks/compare';

import HoveringToolbar from './widgets/HoveringToolbar';
import Element from './widgets/Element';
import Leaf from './widgets/Leaf';

import './TextEditor.scss';

const CLASS = 'st-TextEditor';
export default function TextEditor({value, onChange, onKeyDown, pageId}) {
	const renderElement = useCallback(props => <Element {...props} />, []);
	const renderLeaf = useCallback(props => <Leaf {...props} />, []);
	const editor = useMemo(() => withHistory(withReact(createEditor())), []);
	const previousId = usePrevious(pageId);

	if (pageId !== previousId && editor.selection) {
		const point = {path: [0, 0], offset: 0};
		editor.selection = {anchor: point, focus: point};
	}

	useEffect(() => {
		if (previousId && pageId !== previousId && editor.selection) {
			const point = {path: [0, 0], offset: 0};
			editor.selection = {anchor: point, focus: point};
		}
	}, [previousId, pageId, editor]);

	return (
		<Slate editor={editor} value={value} onChange={onChange}>
			<HoveringToolbar className={CLASS} />
			<Editable
				onKeyDown={onKeyDown}
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
	onChange: PropTypes.func,
	onKeyDown: PropTypes.func,
	pageId: PropTypes.number,
};

TextEditor.defaultProps = {
	onChange: () => {},
	onKeyDown: () => {},
};
