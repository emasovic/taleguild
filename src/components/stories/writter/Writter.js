import React, {useState, useEffect, useRef} from 'react';

import {useDebounce} from 'hooks/debounce';

import TextEditor from 'components/widgets/text-editor/TextEditor';
import Loader from 'components/widgets/loader/Loader';

export default function Writter({className, onStoryPage, storyPages, selectedPage}) {
	const editorRef = useRef(null);

	const [pages, setPages] = useState([]);

	let currentEditing = pages[selectedPage];

	const text = currentEditing && JSON.stringify(currentEditing.text);

	const debouncedSearchTerm = useDebounce(text, 3000);

	// const scrollToBottom = () => {
	// 	editorRef.current && editorRef.current.scrollIntoView({block: 'end', behavior: 'smooth'});
	// };

	const handleEditPage = val => {
		currentEditing = {
			...currentEditing,
			text: val,
		};
		let updatedPages = [...pages];
		updatedPages[selectedPage] = currentEditing;
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

	// useEffect(scrollToBottom, [text]);

	if (!storyPages || !currentEditing) {
		return <Loader />;
	}

	return (
		<div className={className + '-writter'} ref={editorRef}>
			<TextEditor value={currentEditing.text} onChange={handleEditPage} />
		</div>
	);
}
