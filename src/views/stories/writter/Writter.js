import React, {useRef, useCallback} from 'react';
import debounce from 'lodash/debounce';

import {STORY_PAGE_OP} from 'types/story_page';

import TextEditor from 'components/widgets/text-editor/TextEditor';
import Loader from 'components/widgets/loader/Loader';

export default function Writter({className, onCurrentChanged, currentEditing, onStoryPage, published, op}) {
	const editorRef = useRef(null);

	const scrollToBottom = () => {
		const domSelection = window.getSelection();

		if (domSelection.anchorOffset) {
			const domRange = domSelection.getRangeAt(0);
			const rect = domRange.getBoundingClientRect();

			window.scrollTo({
				top: rect.top + window.pageYOffset - 200,
				left: 0,
				behavior: 'smooth',
			});
		}
	};

	const _onStoryPage = useCallback(
		debounce((id, text) => onStoryPage(id, text), 3000),
		[]
	);

	const handleEditPage = val => {
		const currnet = {
			...currentEditing,
			text: val,
		};

		onCurrentChanged(currnet);
		!published && _onStoryPage(currnet.id, val);
	};

	if (!currentEditing || op === STORY_PAGE_OP.create) {
		return <Loader />;
	}

	return (
		<div className={className + '-writter'} ref={editorRef}>
			<TextEditor
				pageId={currentEditing.id}
				value={currentEditing.text}
				onChange={handleEditPage}
				onKeyDown={scrollToBottom}
			/>
		</div>
	);
}
