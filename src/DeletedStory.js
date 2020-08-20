import React from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {HOME} from 'lib/routes';

import {COLOR} from 'types/button';
import {TYPOGRAPHY_LATO, TYPOGRAPHY_MERRI} from 'types/typography';

import {newStory} from 'redux/story';
import {selectUser} from 'redux/user';

import IconButton from 'components/widgets/button/IconButton';

import {ReactComponent as Scroll} from 'images/scroll.svg';

import './DeletedStory.scss';

const CLASS = 'st-DeletedStory';

export default function DeletedStory() {
	const dispatch = useDispatch();
	const {data} = useSelector(selectUser);

	const handleNewStory = () => {
		dispatch(newStory({user: data && data.id, published: false}));
	};
	return (
		<div className={CLASS}>
			<div className={CLASS + '-description'}>
				<span className={TYPOGRAPHY_MERRI.heading_h1_black_bold}>
					And that was the end of your story. Literally end. You delete it.
				</span>
				<span className={TYPOGRAPHY_LATO.placeholder_grey_medium}>
					But you can create other one. Hope that you will not delete that one too. You
					can also read other stories in mean time, just back to home.
				</span>
				<div className={CLASS + '-description-buttons'}>
					<IconButton href={HOME} color={COLOR.secondary}>
						Back to guild
					</IconButton>
					<IconButton onClick={handleNewStory}>Create new story</IconButton>
				</div>
			</div>
			<div className={CLASS + '-scroll'}>
				<Scroll />
			</div>
		</div>
	);
}
