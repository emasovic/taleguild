import React from 'react';
import PropTypes from 'prop-types';
import {useDispatch, useSelector} from 'react-redux';

import {getImageUrl, kFormatter} from 'lib/util';

import {FONTS, TEXT_COLORS, TYPOGRAPHY_VARIANTS} from 'types/typography';

import {selectMarketplaceById} from 'redux/marketplace';
import {selectUser} from 'redux/user';

import ConfirmModal from 'components/widgets/modals/Modal';
import Guildatar from 'components/guildatar/Guildatar';
import Typography from 'components/widgets/typography/Typography';

import {ReactComponent as Coin} from 'images/coin.svg';

import './MarketplaceDialog.scss';
import {purchaseUserItem} from 'redux/userItems';

const CLASS = 'st-MarketplaceDialog';

function MarketplaceDialog({isOpen, itemId, onClose}) {
	const dispatch = useDispatch();

	const {data} = useSelector(selectUser);
	const {op} = useSelector(state => state.userItems);
	const {image, name, price, description, body_part} = useSelector(state =>
		selectMarketplaceById(state, itemId)
	);

	const props = {[body_part]: getImageUrl(image.url)};

	const buyItem = () => {
		dispatch(purchaseUserItem({item: itemId, user: data?.id}));
		onClose();
	};

	const additionalFooterInfo = (
		<div>
			<Typography>
				<Coin />
				&nbsp;&nbsp;{kFormatter(data.coins)}&nbsp;
			</Typography>
			<Typography color={TEXT_COLORS.secondary}>in your chest</Typography>
		</div>
	);

	const renderContent = () => (
		<div className={CLASS}>
			<Guildatar {...props} />
			<Typography
				component={TYPOGRAPHY_VARIANTS.h4}
				variant={TYPOGRAPHY_VARIANTS.h4}
				font={FONTS.merri}
			>
				{name}
			</Typography>
			<Typography component={TYPOGRAPHY_VARIANTS.p} color={TEXT_COLORS.secondary}>
				{description}
			</Typography>
			<Typography>
				<Coin />
				&nbsp;&nbsp;{price} <Typography color={TEXT_COLORS.secondary}>coins</Typography>
			</Typography>
		</div>
	);

	return (
		<ConfirmModal
			className={CLASS + '-dialog'}
			renderFooter
			additionalFooterInfo={additionalFooterInfo}
			isOpen={isOpen}
			title={name}
			content={renderContent()}
			onClose={onClose}
			onSubmit={buyItem}
			submitButtonProps={{disabled: !!op || price > data?.coins}}
			cancelLabel="Cancel"
			confirmLabel="Buy now"
		/>
	);
}

MarketplaceDialog.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	itemId: PropTypes.number.isRequired,
};

export default MarketplaceDialog;
