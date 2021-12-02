import React from 'react';
import PropTypes from 'prop-types';

import './RecentStats.scss';

const CLASS = 'st-RecentStats';

function RecentStats({topStats, bottomStats}) {
	return (
		<div className={CLASS}>
			<div className={CLASS + '-top'}>{topStats}</div>
			{bottomStats}
		</div>
	);
}

RecentStats.propTypes = {
	topStats: PropTypes.node,
	bottomStats: PropTypes.node,
};

export default RecentStats;
