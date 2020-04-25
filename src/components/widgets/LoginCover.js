import React from 'react';
import './LoginCover.scss';
export default function LoginCover(props) {
	const {text} = props;
	return (
		<div className="lg-LoginCover">
			<h1>{text}</h1>
		</div>
	);
}
