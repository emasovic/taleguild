import React from 'react';
import {Button} from 'reactstrap';

import './IconButton.scss';

const CLASS = 'st-IconButton';

export default function IconButton(props) {
	const {onClick, label, children, ...rest} = props;
	return (
		<Button className={CLASS} onClick={onClick} {...rest}>
			{children}
		</Button>
	);
}
