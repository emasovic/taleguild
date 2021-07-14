import React from 'react';
import PropTypes from 'prop-types';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import {Button} from 'reactstrap';

import FA from 'types/font_awesome';

import './IconButton.scss';

const CLASS = 'st-IconButton';

export const toFa = (icon, spin, ...rest) => {
	return <FontAwesomeIcon key={icon} icon={icon} spin={spin} {...rest} />;
};

const IconButton = ({icon, className, children, spin, loading, disabled, href, ...props}) => {
	if (loading) {
		icon = FA.solid_cog;
		disabled = spin = true;
	}

	if (icon) {
		icon = toFa(icon, spin);
	}

	className = classnames(
		CLASS,
		!children && CLASS + '-with-content',
		href && CLASS + '-link',
		className
	);

	if (typeof children !== 'object') {
		// wrap string or number
		children = <span>{children}</span>;
	}

	return (
		<Button className={className} disabled={disabled || loading} href={href} {...props}>
			{icon ? icon : null}
			{children}
		</Button>
	);
};

IconButton.propTypes = {
	icon: PropTypes.object,
	className: PropTypes.string,
	spin: PropTypes.bool,
	loading: PropTypes.bool,
	disabled: PropTypes.bool,
	active: PropTypes.bool,
	onClick: PropTypes.func,
	href: PropTypes.string,
	children: PropTypes.any,
	type: PropTypes.oneOf(['button', 'reset', 'submit']),
};

IconButton.defaultProps = {
	color: 'primary',
};

export default IconButton;
