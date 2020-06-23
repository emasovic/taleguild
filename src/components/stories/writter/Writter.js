import React, {useState, useEffect, useRef} from 'react';

import {useDebounce} from 'hooks/debounce';

import TextEditor from 'components/widgets/text-editor/TextEditor';
import Loader from 'components/widgets/loader/Loader';

export default function Writter({
	className,
	onCurrentChanged,
	currentEditing,
	onStoryPage,
	storyPages,
	selectedPage,
}) {
	const editorRef = useRef(null);

	const [pages, setPages] = useState([]);

	const text = currentEditing && JSON.stringify(currentEditing.text);

	const debouncedSearchTerm = useDebounce(text, 3000);

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

	const handleEditPage = val => {
		const currnet = {
			...currentEditing,
			text: val,
		};
		let updatedPages = [...pages];
		updatedPages[selectedPage] = currnet;
		onCurrentChanged(currnet);
		setPages(updatedPages);
	};

	useEffect(() => {
		if (storyPages) {
			setPages(storyPages);
		}
	}, [storyPages]);

	useEffect(() => {
		if (debouncedSearchTerm) {
			onStoryPage(currentEditing.id, currentEditing.text);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedSearchTerm]);

	if (!storyPages || !currentEditing) {
		return <Loader />;
	}

	return (
		<div className={className + '-writter'} ref={editorRef}>
			<TextEditor
				value={currentEditing.text}
				onChange={handleEditPage}
				onKeyDown={scrollToBottom}
			/>
		</div>
	);
}