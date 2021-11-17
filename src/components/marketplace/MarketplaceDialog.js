import React from 'react';
import PropTypes from 'prop-types';
import {useDispatch, useSelector} from 'react-redux';

import {getImageUrl, kFormatter} from 'lib/util';

import {
	FONTS,
	FONT_WEIGHT,
	TEXT_COLORS,
	TEXT_TRASFORM,
	TYPOGRAPHY_VARIANTS,
} from 'types/typography';

import {selectMarketplaceById} from 'redux/marketplace';
import {selectUser} from 'redux/user';
import {purchaseUserItem} from 'redux/userItems';
import {selectActiveGuildatar} from 'redux/guildatars';

import ConfirmModal from 'components/widgets/modals/Modal';
import Guildatar from 'components/guildatar/Guildatar';
import Typography from 'components/widgets/typography/Typography';

import {ReactComponent as Coin} from 'images/coin.svg';

import './MarketplaceDialog.scss';

const CLASS = 'st-MarketplaceDialog';

function MarketplaceDialog({isOpen, itemId, onClose}) {
	const dispatch = useDispatch();

	const {data} = useSelector(selectUser);
	const {op} = useSelector(state => state.userItems);
	const guildatar = useSelector(selectActiveGuildatar);
	const {image, name, price, description, category, body_part} = useSelector(state =>
		selectMarketplaceById(state, itemId)
	);

	const {head, face, body, left_arm, right_arm} = guildatar || {};
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
			<Guildatar
				head={getImageUrl(head?.item?.image?.url)}
				face={getImageUrl(face?.item?.image?.url)}
				body={getImageUrl(body?.item?.image?.url)}
				leftArm={getImageUrl(left_arm?.item?.image?.url)}
				rightArm={getImageUrl(right_arm?.item?.image?.url)}
				{...props}
			/>
			<Typography
				color={TEXT_COLORS.tertiary}
				textTransform={TEXT_TRASFORM.uppercase}
				fontWeight={FONT_WEIGHT.semiBold}
			>
				{category}
			</Typography>
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
