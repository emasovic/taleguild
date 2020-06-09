import React, {useState, useEffect, useCallback} from 'react';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {useHistory, useParams} from 'react-router-dom';

import {DEFAULT_STORYPAGE_DATA} from 'types/story';

import {
	createOrUpdateStory,
	deleteStory,
	// STORY_OP,
} from 'redux/story';

import {
	loadStoryPages,
	deleteStoryPage,
	createOrUpdateStoryPage,
	selectStoryPages,
} from 'redux/story_pages';

import {useDebounce} from 'hooks/debounce';

import TextEditor from 'components/widgets/text-editor/TextEditor';
import Loader from 'components/widgets/loader/Loader';

import Header from './Header';

import './Writter.scss';

const CLASS = 'st-Writter';

export default function Writter() {
	const dispatch = useDispatch();
	const params = useParams();
	const history = useHistory();

	const {storyPages, op} = useSelector(
		state => ({
			storyPages: selectStoryPages(state),
			op: state.story_pages.op,
		}),
		shallowEqual
	);

	const [pages, setPages] = useState([]);
	const [selectedPage, setSelectedPage] = useState(0);

	let currentEditing = pages && pages[selectedPage];

	const debouncedSearchTerm = useDebounce(
		currentEditing && JSON.stringify(currentEditing.text),
		3000
	);

	const handleStoryPage = useCallback(
		(id, text) => {
			dispatch(
				createOrUpdateStoryPage(
					{
						story: params.id,
						id,
						text: text || DEFAULT_STORYPAGE_DATA,
					},
					history
				)
			);
		},
		[dispatch, history, params]
	);

	const handleCreateOrUpdateStory = useCallback(
		payload => {
			dispatch(createOrUpdateStory(payload, history));
		},
		[dispatch, history]
	);

	const handleRemovePage = useCallback(() => {
		dispatch(deleteStoryPage(params.id, currentEditing.id, history));
	}, [currentEditing, dispatch, params.id, history]);

	const handleRemoveStory = useCallback(() => {
		dispatch(deleteStory(params.id));
	}, [dispatch, params.id]);

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
		dispatch(loadStoryPages(params.id));
	}, [dispatch, params.id]);

	useEffect(() => {
		if (storyPages) {
			setPages(storyPages);
		}
	}, [storyPages]);

	useEffect(() => {
		if (pages && pages.length) {
			let index = pages.findIndex(item => item.id === Number(params.pageId));
			index = index < 0 ? 0 : index;
			setSelectedPage(index);
		}
	}, [pages, params.pageId]);

	useEffect(() => {
		if (debouncedSearchTerm) {
			handleStoryPage(currentEditing.id, currentEditing.text);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedSearchTerm]);

	if (!storyPages || !currentEditing) {
		return <Loader />;
	}

	return (
		<div className={CLASS}>
			<Header
				className={CLASS}
				currentEditing={currentEditing}
				pages={pages}
				selectedPage={selectedPage}
				onSelectedPage={setSelectedPage}
				onPageRemove={handleRemovePage}
				onStoryPage={handleStoryPage}
				onStoryRemove={handleRemoveStory}
				onCreateOrUpdateStory={handleCreateOrUpdateStory}
			/>
			<TextEditor value={currentEditing.text} onChange={handleEditPage} />
			{op && <span>Saving...</span>}
		</div>
	);
}
