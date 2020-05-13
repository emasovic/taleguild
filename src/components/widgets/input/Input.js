import React, {Component} from 'react';
import {Input, FormGroup, FormFeedback} from 'reactstrap';

import './Input.scss';

const CLASS = 'st-Input';

export default class TextInputWithIcon extends Component {
	static defaultProps = {
		placeholder: 'Looking for something specific?',
	};
	onEnter = e => {
		const {onIconClick} = this.props;
		if (e.key !== 'Enter') {
			return null;
		}

		return onIconClick();
	};
	render() {
		const {
			onChange,
			onIconClick,
			value,
			placeholder,
			invalid,
			errorMessage,
			label,
			icon,
			...props
		} = this.props;
		return (
			<FormGroup className={CLASS}>
				{label && <span className="label"> {label} </span>}
				<Input
					placeholder={placeholder}
					value={value}
					onChange={e => onChange(e.target.value)}
					onKeyPress={this.onEnter}
					invalid={invalid}
					{...props}
				/>
				{invalid && <FormFeedback>{errorMessage}</FormFeedback>}
				{/* {icon && (
					<Button onClick={onIconClick}>
						<FontAwesome name={icon} onClick={onIconClick} />
					</Button>
				)} */}
			</FormGroup>
		);
	}
}
