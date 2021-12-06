import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

import {HOME} from 'lib/routes';

import {FONT_WEIGHT, TEXT_COLORS} from 'types/typography';
import {PUBLISH_STATES} from 'types/story';

import {selectAuthUser} from 'redux/auth';
import {loadViews, selectViewsById, selectViewsIds} from 'redux/views';

import StoryListItem from 'views/stories/StoryListItem';

import Typography from 'components/widgets/typography/Typography';
import Loader from 'components/widgets/loader/Loader';
import IconButton from 'components/widgets/button/IconButton';

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
	const {op} = useSelector(state => state.views);

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
					false
				)
			);
	}, [dispatch, userId]);

	if (!views.length && !op) {
		return (
			<div className={CLASS + '-no-items'}>
				<IconButton tag={Link} to={HOME}>
					Visit our community
				</IconButton>
			</div>
		);
	}
	return (
		<div className={CLASS}>
			<Typography color={TEXT_COLORS.secondary} fontWeight={FONT_WEIGHT.bold}>
				Recent readings
			</Typography>
			{!op ? views.map(i => <RecentView key={i} id={i} />) : <Loader />}
		</div>
	);
}
