import React from 'react';
import propTypes from 'prop-types';
import moment from 'moment';
import {Link, useHistory} from 'react-router-dom';
import {ButtonGroup} from 'reactstrap';
import {useDispatch} from 'react-redux';

import {editStory} from 'lib/routes';

import FA from '../../types/font_awesome';
import {COLOR} from '../../types/button';

import {deleteStory} from 'redux/story';

import IconButton from 'components/widgets/button/IconButton';
import Image from 'components/widgets/image/Image';

import './StoryItem.scss';

const CLASS = 'st-StoryItem';

export default function StoryItem({
	id,
	image,
	text,
	title,
	categories,
	likes,
	comments,
	creator,
	createdDate,
	editMode,
}) {
	const dispatch = useDispatch();
	const history = useHistory();

	const goToEdit = e => {
		e.preventDefault();
		history.push(editStory(id));
	};

	const renderCategories =
		categories && categories.length
			? categories.map((item, key) => <span key={key}>{item.display_name}</span>)
			: null;
	return (
		<Link to={`/story/${id}`} className={CLASS}>
			<div className={CLASS + '-cover'}>
				<Image image={image} alt="cover" />
				<div className={CLASS + '-cover-categories'}>{renderCategories}</div>
				<div className={CLASS + '-cover-author'}>
					<p>{title}</p>
					<span>{creator + ' ' + moment(createdDate).format('DD.MM.YYYY')}</span>
				</div>
			</div>

			<div className={CLASS + '-description'}>{text}</div>
			<div className={CLASS + '-footer'}>
				<ButtonGroup size="sm">
					{editMode ? (
						<>
							<IconButton icon={FA.pencil} outline onClick={goToEdit} />
							<IconButton
								icon={FA.trash}
								outline
								color={COLOR.danger}
								onClick={() => dispatch(deleteStory(id, history))}
							/>
						</>
					) : (
						<>
							<IconButton outline color={COLOR.secondary} icon={FA.heart}>
								{likes.length}
							</IconButton>
							<IconButton outline color={COLOR.secondary} icon={FA.comment}>
								{comments.length}
							</IconButton>
							{/* <IconButton outline color={COLOR.secondary} icon={FA.share} /> */}
						</>
					)}
				</ButtonGroup>
				<IconButton outline>Čitaj</IconButton>
			</div>
		</Link>
	);
}

StoryItem.propTypes = {
	src: propTypes.string,
	text: propTypes.string,
	title: propTypes.string,
	creator: propTypes.string,
	createdDate: propTypes.string,
};
