import React from 'react';
import {Link} from 'react-router-dom';

import {USER_STORIES_SAVED} from 'lib/routes';

import {STORY_COMPONENTS} from 'types/story';

import DraftStories from '../stories/DraftStories';
import SavedStories from '../stories/SavedStories';

import './DraftStoriesPage.scss';

const CLASS = 'st-DraftStoriesPage';

export default function DraftStoriesPage() {
	return (
		<div className={CLASS}>
			<div className={CLASS + '-saved'}>
				<SavedStories shouldLoadMore={false} Component={STORY_COMPONENTS.list} />
				<Link to={USER_STORIES_SAVED}>View all</Link>
			</div>
			<DraftStories />

			<div className={CLASS + '-holder'} />
		</div>
	);
}
