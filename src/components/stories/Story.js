import React, {useEffect, useState, useRef} from 'react';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import orderBy from 'lodash/orderBy';

import {useParams} from 'react-router-dom';

import {loadStory, selectStory} from 'redux/story';
import {selectUser} from 'redux/user';

import TextViewer from 'components/widgets/text-editor/TextViewer';
import Loader from 'components/widgets/loader/Loader';
import Pages from 'components/widgets/pagination/Pagination';
import StoryItem from './StoryItem';

import './Story.scss';

const CLASS = 'st-Story';

export default function Story() {
	const {id} = useParams();
	const viewerRef = useRef(null);
	const dispatch = useDispatch();
	const {story} = useSelector(
		state => ({
			story: selectStory(state, id),

			loggedUser: selectUser(state),
		}),
		shallowEqual
	);

	const [activePage, setActivePage] = useState(0);

	const handleActivePage = page => {
		setActivePage(page);
		viewerRef.current && viewerRef.current.scrollIntoView();
	};

	useEffect(() => {
		dispatch(loadStory(id));
	}, [dispatch, id]);

	if (!story) {
		return (
			<div className={CLASS}>
				<Loader />
			</div>
		);
	}

	// if (!story.published) {
	// 	return <Redirect to={HOME} />;
	// }

	let {storypages} = story;
	storypages =
		storypages && storypages.length
			? orderBy(
					storypages.map(item => ({...item, text: JSON.parse(item.text)})),
					['created_at'],
					['asc']
			  )
			: [];

	return (
		<div className={CLASS}>
			<StoryItem
				id={story.id}
				image={story.image}
				title={story.title}
				description={story.description}
				key={story.id}
				categories={story.categories}
				likes={story.likes}
				comments={story.comments}
				storypages={story.storypages}
				author={story.user}
				createdDate={story.created_at}
				savedBy={story.saved_by}
			/>

			{storypages[activePage] && (
				<div className={CLASS + '-viewer'} ref={viewerRef}>
					<TextViewer value={storypages[activePage].text} />
				</div>
			)}

			{storypages && (
				<Pages onClick={handleActivePage} prefix="Page" pages={storypages.length} />
			)}
			<div className={CLASS + '-pages'}>{storypages.length} pages total</div>
		</div>
	);
}
