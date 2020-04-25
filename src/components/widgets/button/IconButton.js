import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import classnames from 'classnames';
import {Button} from 'reactstrap';

import FA from '../../../types/font_awesome';

import './IconButton.scss';

const CLASS = 'st-IconButton';

export const toFa = (icon, spin, ...rest) => {
	return <FontAwesome key={icon} name={icon} spin={spin} {...rest} />;
};

const IconButton = ({
	icon,
	className,
	children,
	spin,
	loading,
	disabled,
	secondary,
	danger,
	...props
}) => {
	if (loading) {
		icon = FA.cog;
		disabled = spin = true;
	}

	if (icon) {
		icon = toFa(icon, spin);
	}

	className = classnames(
		CLASS,
		!children && CLASS + '-with-content',
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
	icon: PropTypes.string,
	className: PropTypes.string,
	direction: PropTypes.string,
	isDropdown: PropTypes.bool,
	spin: PropTypes.bool,
	loading: PropTypes.bool,
	disabled: PropTypes.bool,
	danger: PropTypes.bool,
	active: PropTypes.bool,
	block: PropTypes.bool,
	secondary: PropTypes.bool,
	onClick: PropTypes.func,
	href: PropTypes.string,
	type: PropTypes.oneOf(['button', 'reset', 'submit']),
	label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
};

IconButton.defaultProps = {
	color: 'primary',
};

export default IconButton;
