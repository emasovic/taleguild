import React from 'react';

import {useSelector} from 'react-redux';

import FA from 'types/font_awesome';
import {DEFAULT_OP} from 'types/default';

import {selectCategories} from 'redux/categories';

import SideNav from 'components/widgets/side-nav/SideNav';

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
	const {op} = useSelector(state => state.categories);
	let categories = useSelector(selectCategories);

	categories = categories.map(i => ({...i, icon: CATEGORY_ICONS[i.name]}));

	return (
		<SideNav
			items={categories}
			urlParamName="categories"
			loading={op[DEFAULT_OP.loading].loading || op[DEFAULT_OP.load_more].loading}
			allIcon={FA.solid_box_open}
		/>
	);
}
