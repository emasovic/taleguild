import React from 'react';

import {isMobile} from 'lib/util';

import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';

export default function Nav() {
	return (
		<>
			<DesktopNav isMobile={isMobile} /> {isMobile && <MobileNav />}
		</>
	);
}
