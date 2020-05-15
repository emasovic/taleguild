import React, {useEffect} from 'react';
import propTypes from 'prop-types';
import {useDispatch, useSelector} from 'react-redux';
import {Toast, ToastHeader, ToastBody} from 'reactstrap';

import {removeToast, selectToasts} from 'redux/toast';

import './Toasts.scss';

const CLASS = 'st-Toasts';

export default function Toasts() {
	const dispatch = useDispatch();
	let toasts = useSelector(selectToasts);

	if (!toasts) {
		toasts = [];
	}

	useEffect(() => {
		const diffKeys = Object.keys(toasts || {});
		diffKeys.forEach(key => {
			if (toasts[key].duration > 0) {
				setTimeout(() => {
					if (toasts[key]) {
						dispatch(removeToast(toasts[key].id));
					}
				}, toasts[key].duration);
			}
		});
	}, [dispatch, toasts]);

	return (
		<div className={CLASS}>
			{Object.entries(toasts).map(([k, v]) => (
				<Toast key={k}>
					<ToastHeader icon={v.type} toggle={() => dispatch(removeToast(v.id))}>
						{v.title}
					</ToastHeader>
					<ToastBody>
						{Array.isArray(v.text)
							? v.text.map((item, key) => (
									<span key={key}>
										{item} <br />
									</span>
							  ))
							: v.text}
					</ToastBody>
				</Toast>
			))}
		</div>
	);
}

Toasts.propTypes = {
	toasts: propTypes.object,
};
