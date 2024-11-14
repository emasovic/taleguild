import React, {Fragment} from 'react';
import propTypes from 'prop-types';
import {Input, Label, FormGroup, FormFeedback, InputGroup, InputGroupText} from 'reactstrap';
import classNames from 'classnames';

import FaIcon from '../fa-icon/FaIcon';

import './FloatingInput.scss';

const CLASS = 'st-FloatingInput';

export const INPUT_MARGIN = {
	normal: 'normal',
	dense: 'dense',
	none: 'none',
};

const MARGIN_CLASSES = {
	[INPUT_MARGIN.normal]: CLASS + '-margin__normal',
	[INPUT_MARGIN.dense]: CLASS + '-margin__dense',
	[INPUT_MARGIN.none]: CLASS + '-margin__none',
};

export default function FloatingInput({
	onChange,
	value,
	placeholder,
	invalid,
	errorMessage,
	label,
	className,
	wholeEvent,
	icon,
	margin,
	...rest
}) {
	const Wrapper = !icon ? Fragment : InputGroup;
	return (
		<FormGroup className={classNames(CLASS, className, margin && MARGIN_CLASSES[margin])}>
			{label && <Label>{label}</Label>}
			<Wrapper>
				{icon && (
					<InputGroupText>
						<FaIcon icon={icon} />
					</InputGroupText>
				)}
				<Input
					placeholder={placeholder}
					value={value}
					onChange={e => onChange(wholeEvent ? e : e.target.value)}
					invalid={invalid}
					{...rest}
				/>
			</Wrapper>
			{invalid && <FormFeedback>{errorMessage}</FormFeedback>}
		</FormGroup>
	);
}

FloatingInput.propTypes = {
	onChange: propTypes.func,
	value: propTypes.string,
	placeholder: propTypes.string,
	label: propTypes.string,
	errorMessage: propTypes.string,
	invalid: propTypes.bool,
	className: propTypes.string,
	icon: propTypes.object,
	wholeEvent: propTypes.bool,
	margin: propTypes.string,
};

FloatingInput.defaultProps = {
	onChange: () => {},
};
