import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';

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
import Link, {UNDERLINE} from 'components/widgets/link/Link';

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
				loadViews({
					filters: {
						user: userId,
						// story: {
						// 	$null: true,
						// },
					},
					pagination: {
						start: 0,
						limit: 4,
					},
					publicationState: PUBLISH_STATES.live,
					sort: ['createdAt:DESC'],
				})
			);
	}, [dispatch, userId]);

	return (
		<div className={CLASS}>
			{!!total && (
				<Typography color={TEXT_COLORS.secondary} fontWeight={FONT_WEIGHT.bold}>
					Recent readings
				</Typography>
			)}
			<LoadMore
				id="recentItems"
				loading={!op[DEFAULT_OP.loading].success}
				showItems={op[DEFAULT_OP.loading].success}
				total={total}
				noItemsComponentProps={{
					title: 'Find people to follow',
					subtitle:
						'Follow other writers from the guild, read their stories and ask for advice on writing and acquiring new skills',
					buttonText: 'Visit our community',
					buttonProps: {
						tag: Link,
						to: goToWidget(WIDGETS.explore),
						color: COLOR.secondary,
					},
				}}
				NoItemsComponent={NoItemsPlaceholder}
				shouldLoad={false}
			>
				{views.map(i => (
					<RecentView key={i} id={i} />
				))}
				{!!total && (
					<Link
						to={goToWidget(WIDGETS.explore)}
						underline={UNDERLINE.hover}
						className={CLASS + '-link'}
					>
						Read all
					</Link>
				)}
			</LoadMore>
		</div>
	);
}
