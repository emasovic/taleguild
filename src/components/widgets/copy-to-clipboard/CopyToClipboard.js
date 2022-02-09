import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import FA from 'types/font_awesome';

import useCopyToClipboard from 'hooks/useCopyToClipboard';

import Typography from '../typography/Typography';
import FloatingInput, {INPUT_MARGIN} from '../input/FloatingInput';
import IconButton from '../button/IconButton';

import './CopyToClipboard.scss';

const CLASS = 'st-CopyToClipboard';

function CopyToClipboard({url, title, className}) {
	const [isCopied, handleCopy] = useCopyToClipboard(10000);
	const icon = isCopied ? FA.solid_clipboard_check : FA.clipboard;
	return (
		<div className={classNames(CLASS, className)}>
			{title && <Typography>{title}</Typography>}
			<div className={CLASS + '-action'}>
				<FloatingInput value={url} disabled margin={INPUT_MARGIN.none} />
				<IconButton onClick={() => handleCopy(url)} icon={icon} />
			</div>
		</div>
	);
}

CopyToClipboard.propTypes = {
	url: PropTypes.string.isRequired,
	title: PropTypes.string,
	className: PropTypes.string,
};

export default CopyToClipboard;
