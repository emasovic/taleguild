import React from 'react';
import PropTypes from 'prop-types';

import Loader from 'components/widgets/loader/Loader';
import Typography from 'components/widgets/typography/Typography';

import './RecentStats.scss';

const CLASS = 'st-RecentStats';

function RecentStats({topStats, bottomStats, isLoading, error}) {
	const content = error ? (
		<Typography>{error}</Typography>
	) : (
		<>
			<div className={CLASS + '-top'}>{topStats}</div>
			{bottomStats}
		</>
	);

	return <div className={CLASS}>{isLoading ? <Loader /> : content}</div>;
}

RecentStats.propTypes = {
	topStats: PropTypes.node,
	bottomStats: PropTypes.node,
	isLoading: PropTypes.bool,
	error: PropTypes.string,
};

export default RecentStats;
