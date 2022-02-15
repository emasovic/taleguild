import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import useCopyToClipboard from 'hooks/useCopyToClipboard';

import Typography from '../typography/Typography';
import FloatingInput, {INPUT_MARGIN} from '../input/FloatingInput';
import IconButton from '../button/IconButton';

import './CopyToClipboard.scss';

const CLASS = 'st-CopyToClipboard';

function CopyToClipboard({url, title, copyText, copiedText, buttonProps, className}) {
	const [isCopied, handleCopy] = useCopyToClipboard(10000);
	const text = isCopied ? copiedText : copyText;
	return (
		<div className={classNames(CLASS, className)}>
			{title && <Typography>{title}</Typography>}
			<div className={CLASS + '-action'}>
				<FloatingInput value={url} disabled margin={INPUT_MARGIN.none} />
				<IconButton onClick={() => handleCopy(url)} {...buttonProps}>
					{text}
				</IconButton>
			</div>
		</div>
	);
}

CopyToClipboard.propTypes = {
	url: PropTypes.string.isRequired,
	title: PropTypes.string,
	className: PropTypes.string,
	copyText: PropTypes.string,
	copiedText: PropTypes.string,
	buttonProps: PropTypes.object,
};

CopyToClipboard.defaultProps = {
	copyText: 'Copy',
	copiedText: 'Copied',
	buttonProps: {},
};

export default CopyToClipboard;
