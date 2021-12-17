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
import {selectAuthUser} from 'redux/auth';
import {purchaseUserItem} from 'redux/userItems';

import ConfirmModal from 'components/widgets/modals/Modal';
import Guildatar from 'components/guildatar/Guildatar';
import Typography from 'components/widgets/typography/Typography';

import {ReactComponent as Coin} from 'images/coin.svg';

import './MarketplaceDialog.scss';

const CLASS = 'st-MarketplaceDialog';

function MarketplaceDialog({isOpen, itemId, gender, onClose}) {
	const dispatch = useDispatch();

	const {data} = useSelector(selectAuthUser);
	const {stats} = useSelector(state => state.auth);
	const {image, name, price, description, category, genders, body_part} = useSelector(state =>
		selectMarketplaceById(state, itemId)
	);

	gender = gender || genders[0]?.gender;

	const props = {[body_part]: getImageUrl(image.url)};

	const buyItem = () => {
		dispatch(purchaseUserItem({item: itemId, user: data?.id}));
		onClose();
	};

	const additionalFooterInfo = (
		<div>
			<Typography>
				<Coin />
				&nbsp;&nbsp;{kFormatter(stats.coins)}&nbsp;
			</Typography>
			<Typography color={TEXT_COLORS.secondary}>in your chest</Typography>
		</div>
	);

	const renderContent = () => (
		<div className={CLASS}>
			<Guildatar gender={gender} {...props} />
			<Typography color={TEXT_COLORS.tertiary}>
				This is a preview of your default Guildatar
			</Typography>
			<Typography
				color={TEXT_COLORS.tertiary}
				textTransform={TEXT_TRASFORM.uppercase}
				fontWeight={FONT_WEIGHT.semiBold}
				className={CLASS + '-category'}
			>
				{category?.display_name}
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
			title="Shopping"
			content={renderContent()}
			onClose={onClose}
			onSubmit={buyItem}
			submitButtonProps={{disabled: price > stats?.coins}}
			cancelLabel="Cancel"
			confirmLabel="Buy now"
		/>
	);
}

MarketplaceDialog.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	itemId: PropTypes.number.isRequired,
	gender: PropTypes.string,
};

export default MarketplaceDialog;
