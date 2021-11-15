import React, {useState} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Typography from '../typography/Typography';
import IconButton from '../button/IconButton';

import './ShowMore.scss';

const CLASS = 'st-ShowMore';

function ShowMore({
	text,
	className,
	textComponent,
	textProps,
	actionComponent,
	actionProps,
	numberOfCharacters,
}) {
	const [isOpen, setIsOpen] = useState(false);

	const toggleOpen = () => setIsOpen(prevState => !prevState);
	const buttonText = isOpen ? 'Show less' : 'Show more';
	const shouldCutoff = text > numberOfCharacters;
	const displayText = shouldCutoff && !isOpen ? text.slice(0, numberOfCharacters) : text;

	const TextComponent = textComponent;
	const ActionComponent = actionComponent;
	return (
		<div className={classNames(CLASS, className)}>
			<TextComponent {...textProps}>{displayText}</TextComponent>
			{shouldCutoff && (
				<ActionComponent {...actionProps} onClick={toggleOpen}>
					{buttonText}
				</ActionComponent>
			)}
		</div>
	);
}

ShowMore.defaultProps = {
	numberOfCharacters: 50,
	textComponent: Typography,
	textProps: {},
	actionComponent: IconButton,
	actionProps: {},
};

ShowMore.propTypes = {
	numberOfCharacters: PropTypes.number,
	text: PropTypes.string.isRequired,
	className: PropTypes.string,
	textComponent: PropTypes.any,
	textProps: PropTypes.object,
	actionComponent: PropTypes.any,
	actionProps: PropTypes.object,
};

export default ShowMore;
