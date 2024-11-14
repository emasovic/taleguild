import React from 'react';
import {useSelector} from 'react-redux';

import {DEFAULT_OP} from 'types/default';

import {selectLanguages} from 'redux/languages';

import SideNav from 'components/widgets/side-nav/SideNav';

export default function Languages() {
	const {op} = useSelector(state => state.languages);
	const languages = useSelector(selectLanguages);

	return (
		<SideNav
			items={languages}
			title=""
			loading={op[DEFAULT_OP.loading].loading || op[DEFAULT_OP.load_more].loading}
			urlParamName="language"
		/>
	);
}
