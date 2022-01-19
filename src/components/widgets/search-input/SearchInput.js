import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import {useDispatch} from 'react-redux';

import FA from 'types/font_awesome';

import {navigateToQuery} from 'redux/router';

import FloatingInput from 'components/widgets/input/FloatingInput';

function SearchInput({onChange, urlParamName, ...props}) {
	const dispatch = useDispatch();
	const handleChange = debounce(val => {
		const value = val === '' ? undefined : val;

		urlParamName && dispatch(navigateToQuery({[urlParamName]: value}));
		onChange && onChange(val);
	}, 500);
	return <FloatingInput onChange={handleChange} icon={FA.soild_search} {...props} />;
}

SearchInput.propTypes = {
	onChange: PropTypes.func,
	urlParamName: PropTypes.string,
};

export default SearchInput;
