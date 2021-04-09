import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Dropdown, DropdownToggle, DropdownMenu} from 'reactstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import FA from 'types/font_awesome';
import {COLOR} from 'types/button';

import './DropdownButton.scss';

const CLASS = 'st-DropdownButton';

export default function DropdownButton({children, icon, outline, color, toggleItem, ...props}) {
	const [dropdownOpen, setDropdownOpen] = useState(false);

	const toggle = () => setDropdownOpen(prevState => !prevState);

	return (
		<>
			<Dropdown className={CLASS} isOpen={dropdownOpen} toggle={toggle} {...props}>
				<DropdownToggle outline={outline} color={color} aria-label="dropdown-toggle">
					{toggleItem || <FontAwesomeIcon icon={icon} />}
				</DropdownToggle>
				<DropdownMenu right>{children}</DropdownMenu>
			</Dropdown>
		</>
	);
}

DropdownButton.propTypes = {
	children: PropTypes.any,
	icon: PropTypes.object,
	outline: PropTypes.bool,
	color: PropTypes.string,
	toggleItem: PropTypes.any,
};

DropdownButton.defaultProps = {
	color: COLOR.secondary,
	icon: FA.soild_elipsis_h,
	outline: true,
};
