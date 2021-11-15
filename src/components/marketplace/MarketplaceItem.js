import React from 'react';
import PropTypes from 'prop-types';
import {useSelector} from 'react-redux';

import {TEXT_COLORS, TYPOGRAPHY_VARIANTS} from 'types/typography';

import {selectMarketplaceById} from 'redux/marketplace';

import ImageContainer from 'components/widgets/image/Image';
import Typography from 'components/widgets/typography/Typography';

import {ReactComponent as Coin} from 'images/coin.svg';

import './MarketplaceItem.scss';

const CLASS = 'st-MarketplaceItem';

function MarketplaceItem({id, item, onClick}) {
	const {image, name, price} = useSelector(state => selectMarketplaceById(state, id)) || item;

	return (
		<div className={CLASS} onClick={() => onClick(id)}>
			<ImageContainer image={image} width={100} height={100} />
			<Typography component={TYPOGRAPHY_VARIANTS.p}>{name}</Typography>
			{price && (
				<Typography>
					<Coin />
					&nbsp;&nbsp;{price} <Typography color={TEXT_COLORS.secondary}>coins</Typography>
				</Typography>
			)}
		</div>
	);
}

MarketplaceItem.propTypes = {
	id: PropTypes.number.isRequired,
	onClick: PropTypes.func.isRequired,
	item: PropTypes.object,
};

export default MarketplaceItem;
