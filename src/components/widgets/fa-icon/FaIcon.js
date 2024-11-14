import React from 'react';
import PropTypes from 'prop-types';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

function FaIcon({icon, children, ...rest}) {
	return children ? (
		<FontAwesomeIcon key={icon} icon={icon} {...rest}>
			{children}
		</FontAwesomeIcon>
	) : (
		<FontAwesomeIcon key={icon} icon={icon} {...rest} />
	);
}

FaIcon.propTypes = {
	children: PropTypes.node,
	icon: PropTypes.object.isRequired,
};

export default FaIcon;
