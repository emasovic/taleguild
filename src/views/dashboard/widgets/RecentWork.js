import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';

import {getActivity} from 'lib/api';
import {secondsToHoursMinutes, serializeTextEditorValue} from 'lib/util';
import {editStory} from 'lib/routes';

import {FONTS, FONT_WEIGHT, TEXT_COLORS, TYPOGRAPHY_VARIANTS} from 'types/typography';
import {PUBLISH_STATES} from 'types/story';
import {ICONS} from 'types/icons';

import {loadStories, selectDraftStory, selectStoryIds} from 'redux/draftStories';
import {selectAuthUser} from 'redux/auth';
import {newStory} from 'redux/story';

import {useLoadItems} from 'hooks/getItems';

import Typography from 'components/widgets/typography/Typography';
import Link, {UNDERLINE} from 'components/widgets/link/Link';
import Icon from 'components/widgets/icon/Icon';
import Loader from 'components/widgets/loader/Loader';

import NoItemsPlaceholder from './NoItemsPlaceholder';

import './RecentWork.scss';

const CLASS = 'st-RecentWork';

const RecentItem = ({id}) => {
	const {title, storypages} = useSelector(state => selectDraftStory(state, id));

	let [{data}] = useLoadItems(getActivity, {
		story: id,
		_publicationState: PUBLISH_STATES.preview,
	});
	const storypage = storypages[0];

	data = data.reduce(
		(acc, val) => ({
			coins: acc.coins + val.coins,
			active: acc.active + val.active,
		}),
		{coins: 0, active: 0}
	);

	const text = serializeTextEditorValue(JSON.parse(storypage.text), 200);
	return (
		<Link
			to={editStory(id, storypage?.id)}
			underline={UNDERLINE.none}
			className={CLASS + '-item'}
		>
			<Typography variant={TYPOGRAPHY_VARIANTS.h4} font={FONTS.merri}>
				{title || 'Untitled'}
			</Typography>
			<Typography color={TEXT_COLORS.secondary}>{text}</Typography>

			<div className={CLASS + '-item-stats'}>
				<Typography>
					<Icon icon={ICONS.coin} size={20} /> &nbsp;&nbsp;{data.coins} coins
				</Typography>
				<Typography>
					<Icon icon={ICONS.clock} size={20} /> &nbsp;&nbsp;
					{secondsToHoursMinutes(data.active)} focus time
				</Typography>
			</div>
		</Link>
	);
};

RecentItem.propTypes = {
	id: PropTypes.number.isRequired,
};

export default function RecentWork() {
	const dispatch = useDispatch();

	const stories = useSelector(selectStoryIds);
	const {op} = useSelector(state => state.draftStories);
	const {data} = useSelector(selectAuthUser);

	const userId = data?.id;

	useEffect(() => {
		userId &&
			dispatch(
				loadStories(
					{
						_start: 0,
						_limit: 4,
						_publicationState: PUBLISH_STATES.preview,
						published_at_null: true,
						archived_at_null: true,
						user: userId,
						_sort: 'created_at:DESC',
					},
					false
				)
			);
	}, [dispatch, userId]);

	if (!stories.length && !op) {
		return (
			<NoItemsPlaceholder
				title="Create your first story"
				subtitle="With your writing you can collect coins and create characters from Market"
				buttonText="Write your first story"
				className={CLASS + '-no-items'}
				buttonProps={{
					onClick: () => dispatch(newStory({user: userId, published_at: null})),
				}}
			/>
		);
	}
	return (
		<div className={CLASS}>
			<Typography color={TEXT_COLORS.secondary} fontWeight={FONT_WEIGHT.bold}>
				Recent work
			</Typography>
			{!op ? stories.map(i => <RecentItem key={i} id={i} />) : <Loader />}
		</div>
	);
}
