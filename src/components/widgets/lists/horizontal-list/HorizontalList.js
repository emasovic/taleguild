import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Nav, NavItem, NavLink} from 'reactstrap';
import {useLocation} from 'react-router';
import {useDispatch} from 'react-redux';

import {FONT_WEIGHT, TEXT_COLORS, TYPOGRAPHY_VARIANTS} from 'types/typography';

import {navigateToQuery} from 'redux/router';

import Loader from 'components/widgets/loader/Loader';
import Typography from 'components/widgets/typography/Typography';

import './HorizontalList.scss';

const CLASS = 'st-HorizontalList';

function HorizontalList({
	items,
	loading,
	title,
	additionalParams,
	urlParamName,
	titleProps,
	resetParamsOnChange,
	children,
}) {
	const dispatch = useDispatch();
	const [activeItem, setActiveItem] = useState(null);

	const item = new URLSearchParams(useLocation().search).get(urlParamName);

	const updateQueryParams = itemId =>
		dispatch(
			navigateToQuery({[urlParamName]: itemId, ...additionalParams}, resetParamsOnChange)
		);

	useEffect(() => {
		setActiveItem(item);
	}, [item]);
	return (
		<>
			<Nav className={CLASS}>
				{title && (
					<Typography
						component={TYPOGRAPHY_VARIANTS.p}
						color={TEXT_COLORS.tertiary}
						fontWeight={FONT_WEIGHT.bold}
						{...titleProps}
					>
						{title}
					</Typography>
				)}
				{loading ? (
					<Loader />
				) : (
					<div className={CLASS + '-items'}>
						<NavItem onClick={() => updateQueryParams(undefined)}>
							<NavLink active={!activeItem}>All</NavLink>
						</NavItem>
						{items.length
							? items.map((item, key) => {
									return (
										<NavItem
											key={key}
											onClick={() => updateQueryParams(item.id)}
										>
											<NavLink active={activeItem === item.id}>
												{item.name}
											</NavLink>
										</NavItem>
									);
							  })
							: null}
					</div>
				)}
			</Nav>
			{children && <div className={CLASS + '-children'}>{children}</div>}
		</>
	);
}

HorizontalList.defaultProps = {
	titleProps: {},
	additionalParams: {},
};

HorizontalList.propTypes = {
	additionalParams: PropTypes.object,
	items: PropTypes.array.isRequired,
	loading: PropTypes.bool.isRequired,
	title: PropTypes.string,
	urlParamName: PropTypes.string.isRequired,
	resetParamsOnChange: PropTypes.bool,
	titleProps: PropTypes.object,
	children: PropTypes.node,
};

export default HorizontalList;
