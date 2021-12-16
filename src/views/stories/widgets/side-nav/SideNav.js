import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Nav, NavItem, NavLink} from 'reactstrap';
import {useLocation} from 'react-router';
import {useDispatch} from 'react-redux';

import {FONT_WEIGHT, TEXT_COLORS, TYPOGRAPHY_VARIANTS} from 'types/typography';

import {navigateToQuery} from 'redux/application';

import Loader from 'components/widgets/loader/Loader';
import Typography from 'components/widgets/typography/Typography';
import FaIcon from 'components/widgets/fa-icon/FaIcon';

import './SideNav.scss';

const CLASS = 'st-SideNav';

function SideNav({items, loading, title, urlParamName, allIcon}) {
	const location = useLocation();
	const dispatch = useDispatch();
	const [activeItem, setActiveItem] = useState(null);

	const item = new URLSearchParams(useLocation().search).get(urlParamName);

	const updateQueryParams = itemId =>
		dispatch(navigateToQuery({[urlParamName]: itemId}, location));

	useEffect(() => {
		setActiveItem(item);
	}, [item]);
	return (
		<Nav className={CLASS}>
			<Typography
				variant={TYPOGRAPHY_VARIANTS.action1}
				color={TEXT_COLORS.secondary}
				fontWeight={FONT_WEIGHT.bold}
			>
				{title}
			</Typography>
			{loading ? (
				<Loader />
			) : (
				<>
					<NavItem onClick={() => updateQueryParams(undefined)}>
						<NavLink active={!activeItem}>
							{allIcon && <FaIcon icon={allIcon} />} All
						</NavLink>
					</NavItem>
					{items.length
						? items.map((item, key) => {
								return (
									<NavItem key={key} onClick={() => updateQueryParams(item.id)}>
										<NavLink
											active={
												activeItem === item.id ||
												Number(activeItem) === item.id
											}
										>
											{item.icon && <FaIcon icon={item.icon} />}
											{item.name}
										</NavLink>
									</NavItem>
								);
						  })
						: null}
				</>
			)}
		</Nav>
	);
}

SideNav.defaultProps = {
	title: '',
};

SideNav.propTypes = {
	allIcon: PropTypes.object,
	items: PropTypes.array.isRequired,
	loading: PropTypes.bool.isRequired,
	title: PropTypes.string.isRequired,
	urlParamName: PropTypes.string.isRequired,
};

export default SideNav;
