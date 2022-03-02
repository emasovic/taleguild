import React from 'react';
import PropTypes from 'prop-types';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import {Button} from 'reactstrap';

import FA from 'types/font_awesome';
import {ICON_TYPES} from 'types/icons';

import Icon from '../icon/Icon';

import './IconButton.scss';

const CLASS = 'st-IconButton';

const toIcon = ({icon, spin, type = ICON_TYPES.fa, ...rest}) => {
	let output = <FontAwesomeIcon key={icon} icon={icon} spin={spin} {...rest} />;

	if (type === ICON_TYPES.local) {
		output = <Icon icon={icon} {...rest} />;
	}

	return output;
};

const IconButton = ({
	icon,
	className,
	children,
	spin,
	loading,
	disabled,
	tertiary,
	iconType,
	...props
}) => {
	if (loading) {
		icon = FA.solid_cog;
		disabled = spin = true;
	}

	if (icon) {
		icon = toIcon({icon, spin, type: iconType});
	}

	const isLink = props.href || props.to;

	className = classnames(
		CLASS,
		!children && CLASS + '-with-content',
		isLink && CLASS + '-link',
		tertiary && CLASS + '-tertiary',
		className
	);

	if (typeof children !== 'object') {
		// wrap string or number
		children = <span>{children}</span>;
	}

	return (
		<Button className={className} disabled={disabled || loading} {...props}>
			{icon ? icon : null}
			{children}
		</Button>
	);
};

IconButton.propTypes = {
	icon: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
	className: PropTypes.string,
	spin: PropTypes.bool,
	loading: PropTypes.bool,
	disabled: PropTypes.bool,
	active: PropTypes.bool,
	onClick: PropTypes.func,
	href: PropTypes.string,
	to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
	children: PropTypes.any,
	tertiary: PropTypes.bool,
	iconType: PropTypes.string,
	type: PropTypes.oneOf(['button', 'reset', 'submit']),
};

IconButton.defaultProps = {
	color: 'primary',
};

export default IconButton;
