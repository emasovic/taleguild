import React, {useState} from 'react';
import {Dropdown, DropdownToggle, DropdownMenu} from 'reactstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import FA from 'types/font_awesome';
import {COLOR} from 'types/button';

import './DropdownButton.scss';

const CLASS = 'st-DropdownButton';

export default function DropdownButton({children, icon, color, toggleItem, ...props}) {
	const [dropdownOpen, setDropdownOpen] = useState(false);

	const toggle = () => setDropdownOpen(prevState => !prevState);

	return (
		<>
			<Dropdown className={CLASS} isOpen={dropdownOpen} toggle={toggle} {...props}>
				<DropdownToggle outline color={color}>
					{toggleItem || <FontAwesomeIcon icon={icon} />}
				</DropdownToggle>
				<DropdownMenu right>{children}</DropdownMenu>
			</Dropdown>
		</>
	);
}

DropdownButton.defaultProps = {
	color: COLOR.secondary,
	icon: FA.soild_elipsis_h,
};
