import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Link} from 'react-router-dom';

import {HOME} from 'lib/routes';

import {COLOR} from 'types/button';
import {FONTS, TYPOGRAPHY_VARIANTS} from 'types/typography';

import {newStory} from 'redux/story';
import {selectUser} from 'redux/user';

import IconButton from 'components/widgets/button/IconButton';
import Typography from 'components/widgets/typography/Typography';

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
				<Typography font={FONTS.merri} variant={TYPOGRAPHY_VARIANTS.h1}>
					And that was the end of your story. Literally end. You delete it.
				</Typography>
				<Typography font={FONTS.lato} variant={TYPOGRAPHY_VARIANTS.p14}>
					But you can create other one. Hope that you will not delete that one too. You
					can also read other stories in mean time, just back to home.
				</Typography>
				<div className={CLASS + '-description-buttons'}>
					<IconButton tag={Link} to={HOME} color={COLOR.secondary}>
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
