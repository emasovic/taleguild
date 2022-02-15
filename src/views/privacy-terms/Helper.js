import React, {Fragment} from 'react';
import PropTypes from 'prop-types';

import MobileWrapper from 'components/widgets/mobile-wrapper/MobileWrapper';
import Typography from 'components/widgets/typography/Typography';

function Helper({sections}) {
	return (
		<MobileWrapper>
			{sections.map((i, key) => (
				<Fragment key={key}>
					<Typography {...i.titleProps}>{i.title}</Typography>
					<Typography {...i.subtitleProps}>{i.subtitle}</Typography>
				</Fragment>
			))}
		</MobileWrapper>
	);
}

Helper.propTypes = {
	sections: PropTypes.array.isRequired,
};

export default Helper;
