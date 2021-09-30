import React, {useState, useEffect} from 'react';
import {Nav, NavItem, NavLink} from 'reactstrap';
import {useLocation} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import FA from 'types/font_awesome';

import {navigateToQuery} from 'redux/application';
import {selectCategories} from 'redux/categories';

import Loader from 'components/widgets/loader/Loader';

import './Categories.scss';

const CLASS = 'st-Categories';

const CATEGORY_ICONS = {
	adult: FA.solid_ban,
	adventure: FA.solid_car,
	biography: FA.solid_book_reader,
	children: FA.solid_baby,
	comedy: FA.solid_laugh_beam,
	detective: FA.solid_user_secret,
	drama: FA.solid_theater_masks,
	epic_fantasy: FA.solid_dragon,
	essays: FA.solid_scroll,
	fairy_tale: FA.solid_chess_rook,
	fanfiction: FA.brand_jedi,
	fantasy: FA.solid_hat_wizard,
	historical_fiction: FA.solid_landmark,
	horror: FA.solid_ghost,
	inspirational_stories: FA.solid_lightbulb,
	microfiction: FA.solid_feather,
	mystery: FA.solid_mask,
	non_fiction: FA.solid_book,
	poetry: FA.solid_pen_nib,
	romance: FA.solid_heart,
	science_fiction: FA.solid_user_astronaut,
	thriller: FA.solid_skull,
	tragedy: FA.solid_sad_tear,
};

export default function Categories() {
	const location = useLocation();
	const dispatch = useDispatch();
	const {categories, loading} = useSelector(state => ({
		loading: state.categories.loading,
		categories: selectCategories(state),
	}));
	const [activeCategory, setActiveCategory] = useState(null);

	const category = new URLSearchParams(useLocation().search).get('categories');

	const getStoriesByCategoryId = categoryId => {
		dispatch(navigateToQuery({categories: categoryId}, location));
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
						<NavLink active={!activeCategory}>
							<FontAwesomeIcon icon={FA.solid_box_open} />
							All
						</NavLink>
					</NavItem>
					{categories.length
						? categories.map((item, key) => {
								return (
									<NavItem
										key={key}
										onClick={() => getStoriesByCategoryId(item.id)}
									>
										<NavLink active={activeCategory === item.id}>
											<FontAwesomeIcon icon={CATEGORY_ICONS[item.name]} />
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
