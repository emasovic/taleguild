import React, {useEffect} from 'react';
import propTypes from 'prop-types';
import {useDispatch, useSelector} from 'react-redux';
import {Toast, ToastHeader, ToastBody} from 'reactstrap';

import {FONT_WEIGHT, TEXT_COLORS, TEXT_TRASFORM} from 'types/typography';
import FA from 'types/font_awesome';
import {TOAST_TYPES} from 'types/toast';

import {removeToast, selectToasts} from 'redux/toast';

import Typography from 'components/widgets/typography/Typography';
import FaIcon from 'components/widgets/fa-icon/FaIcon';

import './Toasts.scss';

const CLASS = 'st-Toasts';

const TOAST_CLASSES = {
	[TOAST_TYPES.success]: CLASS + '-success',
	[TOAST_TYPES.warning]: CLASS + '-warning',
	[TOAST_TYPES.error]: CLASS + '-error',
	[TOAST_TYPES.info]: CLASS + '-info',
};
export default function Toasts() {
	const dispatch = useDispatch();
	const toasts = useSelector(selectToasts);

	useEffect(() => {
		toasts.forEach(toast => {
			if (toast.action) {
				toast.action();
			}
			if (toast.duration) {
				setTimeout(() => {
					dispatch(removeToast(toast.id));
				}, toast.duration);
			}
		});
	}, [dispatch, toasts]);

	return (
		<div className={CLASS}>
			{toasts.map(toast => (
				<Toast key={toast.id}>
					<ToastHeader
						toggle={() => dispatch(removeToast(toast.id))}
						close={
							<FaIcon
								icon={FA.solid_times}
								onClick={() => dispatch(removeToast(toast.id))}
							/>
						}
					>
						<Typography
							textTransform={TEXT_TRASFORM.uppercase}
							className={TOAST_CLASSES[toast.type]}
						>
							{toast.type}
						</Typography>
					</ToastHeader>
					<ToastBody>
						<Typography fontWeight={FONT_WEIGHT.bold}>{toast.title}</Typography>
						<Typography color={TEXT_COLORS.secondary}>
							{Array.isArray(toast.text)
								? toast.text.map((item, key) => (
										<span key={key}>
											{item} <br />
										</span>
								  ))
								: toast.text}
						</Typography>
					</ToastBody>
				</Toast>
			))}
		</div>
	);
}

Toasts.propTypes = {
	toasts: propTypes.object,
};
