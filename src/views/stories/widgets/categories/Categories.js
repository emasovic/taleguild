import React from 'react';

import {useSelector} from 'react-redux';

import FA from 'types/font_awesome';

import {selectCategories} from 'redux/categories';

import SideNav from '../side-nav/SideNav';

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
	let {categories, loading} = useSelector(state => ({
		loading: state.categories.loading,
		categories: selectCategories(state),
	}));

	categories = categories.map(i => ({...i, icon: CATEGORY_ICONS[i.name]}));

	return (
		<SideNav
			items={categories}
			urlParamName="categories"
			loading={!!loading}
			allIcon={FA.solid_box_open}
		/>
	);
}
