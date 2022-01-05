import React from 'react';
import {useSelector} from 'react-redux';

import {getLevels} from 'lib/api';
import {ordinalSuffixOf} from 'lib/util';

import {FONTS, TEXT_COLORS, TYPOGRAPHY_VARIANTS} from 'types/typography';
import {ICONS} from 'types/icons';

import {useLoadItems} from 'hooks/getItems';

import Typography from 'components/widgets/typography/Typography';
import Icon from 'components/widgets/icon/Icon';

import RecentStats from './RecentStats';

export default function RecentXp() {
	const {stats} = useSelector(state => state.auth);
	const [{data, error, isLoading}] = useLoadItems(getLevels);

	const currentLevel = data?.find(
		l => stats.points >= l.min_points && stats.points <= l.max_points
	);

	const topStats = (
		<>
			<Typography variant={TYPOGRAPHY_VARIANTS.h3} font={FONTS.merri}>
				{stats.points}/{currentLevel?.max_points}
			</Typography>
			<Icon icon={ICONS.star} />
		</>
	);

	const bottomStats = (
		<Typography>
			{ordinalSuffixOf(currentLevel?.level)}
			<Typography color={TEXT_COLORS.secondary}> level</Typography>
		</Typography>
	);

	return (
		<RecentStats
			topStats={topStats}
			bottomStats={bottomStats}
			isLoading={isLoading}
			error={error}
		/>
	);
}
