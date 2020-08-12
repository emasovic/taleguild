import React, {useState} from 'react';
import {components} from 'react-select';
import AsyncSelect from 'react-select/async';
// import propTypes from 'prop-types';
import {Link} from 'react-router-dom';
import debounce from 'lodash/debounce';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import FA from 'types/font_awesome';

import {getStories} from 'lib/api';

import {goToStory} from 'lib/routes';

import Image from 'components/widgets/image/Image';

import './StoryPicker.scss';

const CLASS = 'st-StoryPicker';

export default function StoryPicker({...props}) {
	const [error, setError] = useState(null);
	const Option = props => {
		const {data} = props;
		return (
			<components.Option {...props}>
				<Link to={goToStory(data.value)}>
					<Image image={data.image} />
					<span>{data.label}</span>
				</Link>
			</components.Option>
		);
	};

	const DropdownIndicator = props => {
		return (
			<components.DropdownIndicator {...props}>
				<FontAwesomeIcon icon={FA.soild_search} />
			</components.DropdownIndicator>
		);
	};

	const _searchStory = (inputValue, callback) => {
		if (inputValue === '') return null;
		getStories({
			_limit: 20,
			_sort: 'likes_count:DESC',
			published: true,
			title_contains: inputValue,
		}).then(result => {
			if (result.error) {
				return setError(error);
			}

			return callback(
				result.map(item => ({
					value: item.id,
					label: item.title,
					image: item.image,
				}))
			);
		});
	};

	const searchStory = debounce(_searchStory, 500);

	return (
		<AsyncSelect
			className={CLASS}
			classNamePrefix={CLASS}
			noOptionsMessage={() => 'No stories found'}
			components={{Option, DropdownIndicator}}
			loadOptions={searchStory}
			cacheOptions
			isClearable
			error={error}
			{...props}
		/>
	);
}
