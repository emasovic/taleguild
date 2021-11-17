import React, {Fragment} from 'react';
import propTypes from 'prop-types';
import {Input, Label, FormGroup, FormFeedback, InputGroup, InputGroupText} from 'reactstrap';
import classnames from 'classnames';

import FaIcon from '../fa-icon/FaIcon';

import './FloatingInput.scss';

const CLASS = 'st-FloatingInput';

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
	...rest
}) {
	const classNames = className ? classnames(CLASS, className) : CLASS;
	const Wrapper = !icon ? Fragment : InputGroup;
	return (
		<FormGroup className={classNames}>
			<Label>{label}</Label>
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
};

FloatingInput.defaultProps = {
	onChange: () => {},
};
