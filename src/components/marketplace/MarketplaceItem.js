import React from 'react';
import PropTypes from 'prop-types';
import {useSelector} from 'react-redux';
import classNames from 'classnames';

import {FONT_WEIGHT, TEXT_COLORS, TEXT_TRASFORM} from 'types/typography';

import {selectMarketplaceById} from 'redux/marketplace';

import ImageContainer from 'components/widgets/image/Image';
import Typography from 'components/widgets/typography/Typography';

import {ReactComponent as Coin} from 'images/coin.svg';

import './MarketplaceItem.scss';

const CLASS = 'st-MarketplaceItem';

function MarketplaceItem({id, onClick, item, displayPrice, active, selector}) {
	const {preview, name, price, category} = useSelector(state => selector(state, id)) || item;
	return (
		<div className={classNames(CLASS, active && 'active')} onClick={() => onClick(id)}>
			<ImageContainer image={preview} width={100} height={100} />
			<div className={CLASS + '-info'}>
				<Typography
					color={TEXT_COLORS.tertiary}
					textTransform={TEXT_TRASFORM.uppercase}
					fontWeight={FONT_WEIGHT.semiBold}
				>
					{category?.display_name}
				</Typography>
				<Typography>{name}</Typography>
				{displayPrice && price && (
					<Typography className={CLASS + '-info-price'}>
						<Coin />
						&nbsp;&nbsp;{price}&nbsp;
						<Typography color={TEXT_COLORS.secondary}>coins</Typography>
					</Typography>
				)}
			</div>
		</div>
	);
}

MarketplaceItem.defaultProps = {
	selector: selectMarketplaceById,
	displayPrice: true,
};

MarketplaceItem.propTypes = {
	id: PropTypes.number.isRequired,
	onClick: PropTypes.func.isRequired,
	displayPrice: PropTypes.bool,
	item: PropTypes.object,
	selector: PropTypes.func,
	active: PropTypes.bool,
};

export default MarketplaceItem;
