import React from 'react';

import {isMobile} from 'lib/util';

import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';
import {useSelector} from 'react-redux';

export default function Nav() {
	const {showMobileNav} = useSelector(state => state.app);
	return (
		<>
			<DesktopNav isMobile={isMobile} /> {isMobile && showMobileNav && <MobileNav />}
		</>
	);
}
