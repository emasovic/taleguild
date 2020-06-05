import React, {useState} from 'react';
import {Nav, NavItem, NavLink} from 'reactstrap';
import {useDispatch} from 'react-redux';

import {DEFAULT_CRITERIA} from 'types/story';

import {useLoadCategories} from 'hooks/categories';
import {loadStories} from 'redux/story';

import Loader from 'components/widgets/loader/Loader';

import './Categories.scss';

const CLASS = 'st-Categories';

export default function Categories() {
	const dispatch = useDispatch();
	const [{data, isLoading}] = useLoadCategories();
	const [activeCategory, setActiveCategory] = useState(null);

	const getStoriesByCategoryId = categoryId => {
		dispatch(loadStories({...DEFAULT_CRITERIA, categories: categoryId}));
		setActiveCategory(categoryId);
	};

	return (
		<Nav className={CLASS}>
			{isLoading ? (
				<Loader />
			) : (
				<>
					<NavItem onClick={() => getStoriesByCategoryId(undefined)}>
						<NavLink href="#" active={!activeCategory}>
							Sve
						</NavLink>
					</NavItem>
					{data.length
						? data.map((item, key) => {
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
