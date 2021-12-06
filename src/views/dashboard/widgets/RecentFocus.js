import React from 'react';
import {useSelector} from 'react-redux';
import {addDays} from 'date-fns';

import {getActivity} from 'lib/api';
import {secondsToHoursMinutes, setTimeToDate} from 'lib/util';

import {FONTS, TEXT_COLORS, TYPOGRAPHY_VARIANTS} from 'types/typography';
import {ICONS} from 'types/icons';

import {selectAuthUser} from 'redux/auth';

import {useLoadItems} from 'hooks/getItems';

import Typography from 'components/widgets/typography/Typography';
import Icon from 'components/widgets/icon/Icon';

import RecentStats from './RecentStats';

export default function RecentFocus() {
	const {data} = useSelector(selectAuthUser);
	const [{data: result, isLoading, error}] = useLoadItems(getActivity, {
		user: data.id,
		created_at_gte: setTimeToDate(0, 0, 0),
		created_at_lte: addDays(new Date(setTimeToDate(23, 59, 59)), 7).toISOString(),
	});

	const totalActive = result.reduce((acc, val) => acc + val.active, 0);
	const active = !error ? secondsToHoursMinutes(totalActive) : 0;

	const title = !totalActive ? 'Start to write' : `${active} h`;

	const topStats = (
		<>
			<Typography variant={TYPOGRAPHY_VARIANTS.h3} font={FONTS.merri}>
				{title}
			</Typography>
			<Icon icon={ICONS.clock} />
		</>
	);

	const bottomStats = (
		<Typography color={TEXT_COLORS.secondary}>Focus time for this week</Typography>
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
