import React, {useState} from 'react';
import {Nav, NavItem} from 'reactstrap';
import {useDispatch} from 'react-redux';

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
		dispatch(loadStories({categories: categoryId, published: true}));
		setActiveCategory(categoryId);
	};

	return (
		<div className={CLASS}>
			<span>Kategorije</span>
			{isLoading ? (
				<Loader />
			) : (
				<Nav>
					<NavItem onClick={() => getStoriesByCategoryId(undefined)}>
						<p
							className={
								!activeCategory ? `${CLASS}-itemActive` : `${CLASS}-item`
							}
						>
							Sve
						</p>
					</NavItem>
					{data.length
						? data.map(item => (
								<NavItem key={item.id}>
									<p
										className={
											activeCategory === item.id
												? `${CLASS}-itemActive`
												: `${CLASS}-item`
										}
										onClick={() => getStoriesByCategoryId(item.id)}
									>
										{item.display_name}
									</p>
								</NavItem>
						  ))
						: null}
				</Nav>
			)}
		</div>
	);
}
