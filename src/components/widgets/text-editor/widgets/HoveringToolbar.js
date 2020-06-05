import React, {useRef, useEffect} from 'react';
import {ReactEditor, useSlate} from 'slate-react';
import {Editor} from 'slate';
import {Range} from 'slate';

import FA from 'types/font_awesome';

import Portal from './Portal';
import Menu from './Menu';
import {FormatButton, BlockButton} from './Buttons';

export default function HoveringToolbar({className}) {
	const ref = useRef();
	const editor = useSlate();

	useEffect(() => {
		const el = ref.current;
		const {selection} = editor;

		if (!el) {
			return;
		}

		if (
			!selection ||
			!ReactEditor.isFocused(editor) ||
			Range.isCollapsed(selection) ||
			Editor.string(editor, selection) === ''
		) {
			el.removeAttribute('style');
			return;
		}

		const domSelection = window.getSelection();
		const domRange = domSelection.getRangeAt(0);
		const rect = domRange.getBoundingClientRect();
		el.style.opacity = 1;
		el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight}px`;
		el.style.left = `${rect.left + window.pageXOffset - el.offsetWidth / 2 + rect.width / 2}px`;
	});

	return (
		<Portal>
			<Menu className={className + '-menu'} ref={ref}>
				<FormatButton format="bold" icon={FA.solid_bold} />
				<FormatButton format="italic" icon={FA.solid_italic} />
				<FormatButton format="underline" icon={FA.solid_underline} />
				<BlockButton format="heading-three" icon={FA.solid_heading} />
			</Menu>
		</Portal>
	);
}
