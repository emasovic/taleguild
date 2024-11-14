import React, {useRef} from 'react';

import PropTypes from 'prop-types';

import FA from 'types/font_awesome';

import Menu from './Menu';
import Counter from './Counter';
import {FormatButton, BlockButton} from './Buttons';

export default function Toolbar({className, value}) {
	const ref = useRef();

	return (
		<Menu className={className + '-toolbar'} ref={ref}>
			<div className={className + '-toolbar-formats'}>
				<FormatButton format="bold" tertiary outline icon={FA.solid_bold} />
				<FormatButton format="italic" tertiary outline icon={FA.solid_italic} />
				<FormatButton format="underline" tertiary outline icon={FA.solid_underline} />
				<BlockButton format="heading-four" tertiary outline icon={FA.solid_heading} />
			</div>

			<div className={className + '-toolbar-counter'}>
				<Counter value={value} />
			</div>
		</Menu>
	);
}

Toolbar.propTypes = {
	className: PropTypes.string,
	value: PropTypes.array.isRequired,
};
