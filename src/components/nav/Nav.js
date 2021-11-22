import React from 'react';

import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';

export default function Nav() {
	const isMobile = window.screen.width < 768;
	return (
		<>
			<DesktopNav isMobile={isMobile} /> {isMobile && <MobileNav />}
		</>
	);
}
