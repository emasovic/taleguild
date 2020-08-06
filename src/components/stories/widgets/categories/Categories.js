import React, {useState, useEffect} from 'react';
import {Nav, NavItem, NavLink} from 'reactstrap';
import {useHistory, useLocation} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';

import {navigateToQuery} from 'redux/application';
import {selectCategories} from 'redux/categories';

import Loader from 'components/widgets/loader/Loader';

import './Categories.scss';

const CLASS = 'st-Categories';

export default function Categories() {
	const history = useHistory();
	const location = useLocation();
	const dispatch = useDispatch();
	const {categories, loading} = useSelector(state => ({
		loading: state.categories.loading,
		categories: selectCategories(state),
	}));
	const [activeCategory, setActiveCategory] = useState(null);

	const category = new URLSearchParams(useLocation().search).get('categories');

	const getStoriesByCategoryId = categoryId => {
		dispatch(navigateToQuery({categories: categoryId}, location, history));
	};

	useEffect(() => {
		setActiveCategory(Number(category));
	}, [category]);

	return (
		<Nav className={CLASS}>
			<span>Categories</span>
			{loading ? (
				<Loader />
			) : (
				<>
					<NavItem onClick={() => getStoriesByCategoryId(undefined)}>
						<NavLink href="#" active={!activeCategory}>
							All
						</NavLink>
					</NavItem>
					{categories.length
						? categories.map((item, key) => {
								return (
									<NavItem
										key={key}
										href="#"
										onClick={() => getStoriesByCategoryId(item.id)}
									>
										<NavLink active={activeCategory === item.id}>
											{item.display_name}
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
