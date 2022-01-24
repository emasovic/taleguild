import React, {useEffect, useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import propTypes from 'prop-types';

import {STORY_COMPONENTS} from 'types/story';
import {DEFAULT_OP} from 'types/default';
import {REDUX_STATE} from 'types/redux';

import LoadMore from 'components/widgets/loadmore/LoadMore';
import NoStories from 'views/stories/NoStories';
import Typography from 'components/widgets/typography/Typography';
import Link, {UNDERLINE} from 'components/widgets/link/Link';

import './StoryList.scss';

const CLASS = 'st-StoryList';

export default function StoryList({
	shouldLoadMore,
	loadItems,
	selector,
	reduxState,
	criteria,
	shouldTriggerLoad,
	Component,
	title,
	onDeleteStory,
	componentSelector,
	NoItemsComponent,
	noItemsComponentProps,
	to,
}) {
	const dispatch = useDispatch();
	let stories = useSelector(selector);
	const {op, total} = useSelector(state => state[reduxState]);

	stories =
		reduxState === REDUX_STATE.savedStories ? stories.map(i => ({...i?.story, ...i})) : stories;

	const shouldLoad =
		total > stories.length &&
		shouldLoadMore &&
		!op[DEFAULT_OP.loading].loading &&
		!op[DEFAULT_OP.load_more].loading;

	const handleLoadStories = useCallback(
		(op, _start) => {
			shouldTriggerLoad &&
				dispatch(
					loadItems(
						{
							...criteria,
							_start,
						},
						op
					)
				);
		},
		[dispatch, loadItems, shouldTriggerLoad, criteria]
	);

	useEffect(() => handleLoadStories(undefined, 0), [dispatch, handleLoadStories]);

	return (
		<LoadMore
			onLoadMore={() => handleLoadStories(DEFAULT_OP.load_more, stories.length)}
			loading={op[DEFAULT_OP.loading].loading || op[DEFAULT_OP.load_more].loading}
			showItems={op[DEFAULT_OP.loading].success}
			shouldLoad={shouldLoad}
			total={total}
			className={CLASS}
			NoItemsComponent={NoItemsComponent}
			noItemsComponentProps={noItemsComponentProps}
			id="storyList"
		>
			<Typography>{!!total && title}</Typography>
			{stories.map(item => (
				<Component
					id={item.id}
					image={item.image}
					formats={item.image && item.image.formats}
					title={item.title}
					description={item.description}
					key={item.id}
					author={item?.story?.user || item.user}
					createdDate={item.published_at}
					archivedAt={item.archived_at}
					slug={item.slug}
					storypages={item.storypages}
					onDeleteStory={onDeleteStory}
					selector={componentSelector}
				/>
			))}
			{!!stories.length && to && (
				<Link to={to} className={CLASS + '-view-all'} underline={UNDERLINE.hover}>
					View all
				</Link>
			)}
		</LoadMore>
	);
}

StoryList.defaultProps = {
	shouldLoadMore: true,
	shouldTriggerLoad: true,
	Component: STORY_COMPONENTS.thumb,
	NoItemsComponent: NoStories,
	noItemsComponentProps: {},
};

StoryList.propTypes = {
	shouldLoadMore: propTypes.bool,
	Component: propTypes.any,
	loadItems: propTypes.func.isRequired,
	selector: propTypes.func.isRequired,
	reduxState: propTypes.string.isRequired,
	criteria: propTypes.object,
	shouldTriggerLoad: propTypes.bool,
	title: propTypes.string.isRequired,
	onDeleteStory: propTypes.func,
	NoItemsComponent: propTypes.func,
	noItemsComponentProps: propTypes.object,
	componentSelector: propTypes.func,
	to: propTypes.string,
};
