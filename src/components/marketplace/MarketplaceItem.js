import React from 'react';
import PropTypes from 'prop-types';
import {useSelector} from 'react-redux';
import classNames from 'classnames';

import {FONT_WEIGHT, TEXT_COLORS, TEXT_TRASFORM, TEXT_WRAP} from 'types/typography';
import FA from 'types/font_awesome';

import {selectMarketplaceById} from 'redux/marketplace';

import ImageContainer from 'components/widgets/image/Image';
import Typography from 'components/widgets/typography/Typography';

import {ReactComponent as Coin} from 'images/coin.svg';

import './MarketplaceItem.scss';

const CLASS = 'st-MarketplaceItem';

function MarketplaceItem({
	id,
	onClick,
	item,
	itemNameProps,
	displayPrice,
	singleView,
	active,
	userStats,
	selector,
	className,
}) {
	const {preview, name, price, category, level} =
		useSelector(state => selector(state, id)) || item;
	const isLevelRequired = level?.min_points > userStats?.points;
	const showPrice = displayPrice && price && !isLevelRequired;

	if (isLevelRequired) {
		itemNameProps = {...itemNameProps, color: TEXT_COLORS.tertiary};
	}

	return (
		<div
			className={classNames(
				CLASS,
				isLevelRequired && CLASS + '-required',
				singleView && CLASS + '-single',
				active && 'active',
				className
			)}
			onClick={() => onClick(id)}
		>
			<ImageContainer image={preview} width={100} height={100} />
			<div className={CLASS + '-info'}>
				<Typography
					color={TEXT_COLORS.tertiary}
					textTransform={TEXT_TRASFORM.uppercase}
					fontWeight={FONT_WEIGHT.semiBold}
					className={CLASS + '-info-category'}
				>
					{category?.display_name}
				</Typography>
				<Typography
					wrap={TEXT_WRAP.ellipsis}
					className={CLASS + '-info-name'}
					{...itemNameProps}
				>
					{name}
				</Typography>
				{showPrice && (
					<Typography className={CLASS + '-info-price'}>
						<Coin />
						&nbsp;&nbsp;{price}&nbsp;
						<Typography color={TEXT_COLORS.secondary}>coins</Typography>
					</Typography>
				)}
				{isLevelRequired && (
					<Typography
						className={CLASS + '-info-level'}
						color={TEXT_COLORS.tertiary}
						icon={FA.solid_lock}
					>
						<Typography color={TEXT_COLORS.secondary}>Level {level?.level}</Typography>
						&nbsp; required
					</Typography>
				)}
			</div>
		</div>
	);
}

MarketplaceItem.defaultProps = {
	selector: selectMarketplaceById,
	itemNameProps: {},
	displayPrice: true,
};

MarketplaceItem.propTypes = {
	id: PropTypes.number.isRequired,
	onClick: PropTypes.func.isRequired,
	displayPrice: PropTypes.bool,
	item: PropTypes.object,
	selector: PropTypes.func,
	active: PropTypes.bool,
	userStats: PropTypes.object,
	itemNameProps: PropTypes.object,
	singleView: PropTypes.bool,
	className: PropTypes.string,
};

export default MarketplaceItem;
