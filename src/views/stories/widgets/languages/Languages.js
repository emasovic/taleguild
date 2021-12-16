import React from 'react';

import {useSelector} from 'react-redux';

import {selectLanguages} from 'redux/languages';

import SideNav from '../../../../components/widgets/side-nav/SideNav';

export default function Languages() {
	const {languages, loading} = useSelector(state => ({
		loading: state.languages.loading,
		languages: selectLanguages(state),
	}));

	return <SideNav items={languages} title="" loading={!!loading} urlParamName="language" />;
}
