import React, {useEffect, useCallback, useState} from 'react';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {useParams} from 'react-router-dom';

import {DEFAULT_STORYPAGE_DATA, PUBLISH_STATES} from 'types/story';

import {
	loadStoryPages,
	deleteStoryPage,
	createOrUpdateStoryPage,
	selectStoryPages,
	loadStoryPage,
} from 'redux/story_pages';
import {createOrUpdateStory, deleteStory, selectStory} from 'redux/story';

import Loader from 'components/widgets/loader/Loader';

import Header from './Header';
import Writter from './Writter';

import './StoryWritter.scss';

const CLASS = 'st-StoryWritter';

export default function StoryWritter() {
	const dispatch = useDispatch();
	const {id: storyId, pageId} = useParams();

	const {pages, story, op, loading} = useSelector(
		state => ({
			pages: selectStoryPages(state),
			story: selectStory(state, storyId),
			loading: state.story_pages.loading,
			op: state.story_pages.op,
		}),
		shallowEqual
	);

	const [selectedPage, setSelectedPage] = useState(0);
	const [current, handleCurrent] = useState(null);

	const handleCreateOrUpdateStory = useCallback(
		(payload, shouldChange) => {
			dispatch(createOrUpdateStory(payload, shouldChange));
		},
		[dispatch]
	);

	const handleStoryPage = useCallback(
		(id, text) => {
			dispatch(
				createOrUpdateStoryPage({
					story: storyId,
					id,
					text: text || DEFAULT_STORYPAGE_DATA,
				})
			);
		},
		[dispatch, storyId]
	);

	const handleSelectedPage = useCallback(
		id => {
			dispatch(
				loadStoryPage({
					story: storyId,
					id,
				})
			);
		},
		[dispatch, storyId]
	);

	const handleRemovePage = useCallback(() => {
		dispatch(deleteStoryPage(storyId, pageId));
	}, [pageId, dispatch, storyId]);

	const handleRemoveStory = useCallback(() => {
		dispatch(deleteStory(storyId));
	}, [dispatch, storyId]);

	useEffect(() => {
		dispatch(loadStoryPages({story: storyId, _publicationState: PUBLISH_STATES.preview}));
	}, [dispatch, storyId]);

	useEffect(() => {
		if (pages && pages.length) {
			let index = pages.findIndex(item => item.id === Number(pageId));
			index = index < 0 ? 0 : index;
			handleCurrent(pages[index]);
			setSelectedPage(index);
		}
	}, [pages, pageId]);

	if (!pages || loading) {
		return <Loader />;
	}

	return (
		<div className={CLASS}>
			<Header
				className={CLASS}
				pages={pages}
				op={op}
				story={story}
				currentEditing={current}
				selectedPage={selectedPage}
				onSelectedPage={handleSelectedPage}
				onPageRemove={handleRemovePage}
				onStoryPage={handleStoryPage}
				onStoryRemove={handleRemoveStory}
				onCreateOrUpdateStory={handleCreateOrUpdateStory}
			/>

			<Writter
				className={CLASS}
				currentEditing={current}
				published={!!story?.published_at}
				onCurrentChanged={handleCurrent}
				onStoryPage={handleStoryPage}
				op={op}
			/>
		</div>
	);
}
