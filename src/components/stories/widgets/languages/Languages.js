import React, {useState, useEffect} from 'react';
import {Nav, NavItem, NavLink} from 'reactstrap';
import {useHistory, useLocation} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import orderBy from 'lodash/orderBy';

import {navigateToQuery} from 'redux/application';
import {selectLanguages} from 'redux/languages';

import Loader from 'components/widgets/loader/Loader';

import './Languages.scss';

const CLASS = 'st-Languages';

export default function Languages() {
	const history = useHistory();
	const location = useLocation();
	const dispatch = useDispatch();
	const {languages, loading} = useSelector(state => ({
		loading: state.languages.loading,
		languages: selectLanguages(state),
	}));
	const [activeCategory, setActiveCategory] = useState(null);

	const category = new URLSearchParams(useLocation().search).get('language');

	const getStoriesByCategoryId = languageId => {
		dispatch(navigateToQuery({language: languageId}, location, history));
	};

	useEffect(() => {
		setActiveCategory(Number(category));
	}, [category]);

	return (
		<Nav className={CLASS}>
			<span>Languages</span>
			{loading ? (
				<Loader />
			) : (
				<>
					<NavItem onClick={() => getStoriesByCategoryId(undefined)}>
						<NavLink active={!activeCategory}>All</NavLink>
					</NavItem>
					{languages.length
						? orderBy(languages, 'name').map((item, key) => {
								return (
									<NavItem
										key={key}
										onClick={() => getStoriesByCategoryId(item.id)}
									>
										<NavLink active={activeCategory === item.id}>
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
