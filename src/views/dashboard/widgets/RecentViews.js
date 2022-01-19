import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

import {goToWidget} from 'lib/routes';

import {COLOR} from 'types/button';
import {FONT_WEIGHT, TEXT_COLORS} from 'types/typography';
import {PUBLISH_STATES} from 'types/story';
import {DEFAULT_OP} from 'types/default';

import {selectAuthUser} from 'redux/auth';
import {loadViews, selectViewsById, selectViewsIds} from 'redux/views';

import StoryListItem from 'views/stories/StoryListItem';
import {WIDGETS} from 'views/community/Community';

import Typography from 'components/widgets/typography/Typography';
import LoadMore from 'components/widgets/loadmore/LoadMore';

import NoItemsPlaceholder from './NoItemsPlaceholder';

import './RecentViews.scss';

const CLASS = 'st-RecentViews';

const RecentView = ({id}) => {
	const {story} = useSelector(state => selectViewsById(state, id));

	const {image, slug, title} = story || {};

	return <StoryListItem formats={image?.formats} image={image} slug={slug} title={title} />;
};

RecentView.propTypes = {
	id: PropTypes.number.isRequired,
};

export default function RecentViews() {
	const dispatch = useDispatch();
	const {data} = useSelector(selectAuthUser);

	const userId = data?.id;

	const views = useSelector(selectViewsIds);
	const {op, total} = useSelector(state => state.views);

	useEffect(() => {
		userId &&
			dispatch(
				loadViews(
					{
						_start: 0,
						_limit: 4,
						_publicationState: PUBLISH_STATES.live,
						story_null: false,
						user: userId,
						_sort: 'created_at:DESC',
					},
					true
				)
			);
	}, [dispatch, userId]);

	if (!views.length && op[DEFAULT_OP.loading].success) {
		return (
			<div>
				<NoItemsPlaceholder
					title="Find people to follow"
					subtitle="With your writing you can collect coins and create characters from Market"
					buttonText="Visit our community"
					buttonProps={{
						tag: Link,
						to: goToWidget(WIDGETS.explore),
						color: COLOR.secondary,
					}}
				/>
			</div>
		);
	}
	return (
		<div className={CLASS}>
			<Typography color={TEXT_COLORS.secondary} fontWeight={FONT_WEIGHT.bold}>
				Recent readings
			</Typography>
			<LoadMore
				id="recentItems"
				loading={!op[DEFAULT_OP.loading].success}
				showItems={op[DEFAULT_OP.loading].success}
				total={total}
				shouldLoad={false}
			>
				{views.map(i => (
					<RecentView key={i} id={i} />
				))}
			</LoadMore>
		</div>
	);
}
