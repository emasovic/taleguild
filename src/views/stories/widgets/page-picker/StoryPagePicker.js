import React from 'react';
import Select, {components} from 'react-select';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import propTypes from 'prop-types';
import {Link} from 'react-router-dom';

import {editStory} from 'lib/routes';

import {COLOR} from 'types/button';
import FA from 'types/font_awesome';

import IconButton from 'components/widgets/button/IconButton';

import './StoryPagePicker.scss';

const CLASS = 'st-StoryPagePicker';

export default function StoryPagePicker({onChange, value, pages, onNewPageClick, ...rest}) {
	const Option = props => {
		const {data} = props;
		if (data.custom) {
			return (
				<components.Option {...props}>
					<IconButton color={COLOR.secondary} icon={FA.solid_plus} onClick={data.onClick}>
						{data.label}
					</IconButton>
				</components.Option>
			);
		}
		return (
			<Link to={editStory(data.storyId, data.value)}>
				<components.Option {...props}>
					<span>{data.label}</span>
				</components.Option>
			</Link>
		);
	};

	const DropdownIndicator = props => {
		return (
			<components.DropdownIndicator {...props}>
				<FontAwesomeIcon icon={FA.solid_bars} />
			</components.DropdownIndicator>
		);
	};

	const options = pages.map((item, key) => ({
		label: `Page ${key + 1}`,
		storyId: item.story.id || item.story,
		value: item.id,
		index: key,
	}));
	options.push({label: 'New page', custom: true, onClick: onNewPageClick});
	return (
		<Select
			onChange={val => onChange(val)}
			components={{Option, DropdownIndicator}}
			options={options}
			value={options[value]}
			className={CLASS}
			classNamePrefix={CLASS}
			isSearchable={false}
			{...rest}
		/>
	);
}

StoryPagePicker.propTypes = {
	onChange: propTypes.func,
	onNewPageClick: propTypes.func,
	value: propTypes.number,
	pages: propTypes.array,
	data: propTypes.object
};

StoryPagePicker.defaultProps = {
	onChange: () => {},
	onNewPageClick: () => {},
};
