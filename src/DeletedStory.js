import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Link} from 'react-router-dom';

import {DASHBOARD} from 'lib/routes';

import {COLOR} from 'types/button';
import {FONTS, FONT_WEIGHT, TYPOGRAPHY_VARIANTS} from 'types/typography';

import {newStory} from 'redux/story';
import {selectAuthUser} from 'redux/auth';

import IconButton from 'components/widgets/button/IconButton';
import Typography from 'components/widgets/typography/Typography';

import {ReactComponent as Scroll} from 'images/scroll.svg';

import './DeletedStory.scss';

const CLASS = 'st-DeletedStory';

export default function DeletedStory() {
	const dispatch = useDispatch();
	const {data} = useSelector(selectAuthUser);

	const handleNewStory = () => {
		dispatch(newStory({user: data && data.id, published_at: null}));
	};
	return (
		<div className={CLASS}>
			<div className={CLASS + '-description'}>
				<Typography
					font={FONTS.merri}
					variant={TYPOGRAPHY_VARIANTS.h1}
					fontWeight={FONT_WEIGHT.bold}
				>
					And that is the end of your story. You deleted it.
				</Typography>
				<Typography font={FONTS.lato} variant={TYPOGRAPHY_VARIANTS.action1}>
					But don't worry, your coins and XP have been saved. Deleting a story is another
					important experience in acquiring a writing skills. Many great stories are made
					up of deleted pieces. You can create another story or you can continue to
					explore our guild and meet other writers.
				</Typography>
				<div className={CLASS + '-description-buttons'}>
					<IconButton tag={Link} to={DASHBOARD} color={COLOR.secondary}>
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
