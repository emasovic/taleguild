import React, {useEffect, useCallback, useState} from 'react';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {useParams, useHistory} from 'react-router-dom';

import {DEFAULT_STORYPAGE_DATA} from 'types/story';

import {
	loadStoryPages,
	deleteStoryPage,
	createOrUpdateStoryPage,
	selectStoryPages,
} from 'redux/story_pages';
import {createOrUpdateStory, deleteStory} from 'redux/story';

import Loader from 'components/widgets/loader/Loader';

import Header from './Header';
import Writter from './Writter';

import './StoryWritter.scss';

const CLASS = 'st-StoryWritter';

export default function StoryWritter() {
	const dispatch = useDispatch();
	const history = useHistory();
	const {id: storyId, pageId} = useParams();

	const {pages, op} = useSelector(
		state => ({
			pages: selectStoryPages(state),
			op: state.story_pages.op,
		}),
		shallowEqual
	);

	const [selectedPage, setSelectedPage] = useState(0);

	const handleCreateOrUpdateStory = useCallback(
		payload => {
			dispatch(createOrUpdateStory(payload, history));
		},
		[dispatch, history]
	);

	const handleStoryPage = useCallback(
		(id, text) => {
			dispatch(
				createOrUpdateStoryPage(
					{
						story: storyId,
						id,
						text: text || DEFAULT_STORYPAGE_DATA,
					},
					history
				)
			);
		},
		[dispatch, history, storyId]
	);

	const handleRemovePage = useCallback(() => {
		dispatch(deleteStoryPage(storyId, pageId, history));
	}, [pageId, dispatch, storyId, history]);

	const handleRemoveStory = useCallback(() => {
		dispatch(deleteStory(storyId));
	}, [dispatch, storyId]);

	useEffect(() => {
		dispatch(loadStoryPages(storyId));
	}, [dispatch, storyId]);

	useEffect(() => {
		if (pages && pages.length) {
			let index = pages.findIndex(item => item.id === Number(pageId));
			index = index < 0 ? 0 : index;
			setSelectedPage(index);
		}
	}, [pages, pageId]);

	if (!pages) {
		return <Loader />;
	}

	return (
		<div className={CLASS}>
			<Header
				className={CLASS}
				pages={pages}
				selectedPage={selectedPage}
				onSelectedPage={setSelectedPage}
				onPageRemove={handleRemovePage}
				onStoryPage={handleStoryPage}
				onStoryRemove={handleRemoveStory}
				onCreateOrUpdateStory={handleCreateOrUpdateStory}
			/>
			<Writter
				className={CLASS}
				onStoryPage={handleStoryPage}
				storyPages={pages}
				selectedPage={selectedPage}
				op={op}
			/>
			{op && <span>Saving...</span>}
		</div>
	);
}
