import React from 'react';
import {Link} from 'react-router-dom';

import {USER_STORIES_DRAFTS} from 'lib/routes';

import DraftStories from '../stories/DraftStories';
import SavedStories from '../stories/SavedStories';

import './SavedStoriesPage.scss';

const CLASS = 'st-SavedStoriesPage';

export default function SavedStoriesPage() {
	return (
		<div className={CLASS}>
			<div className={CLASS + '-drafts'}>
				<DraftStories shouldLoadMore={false} />
				<Link to={USER_STORIES_DRAFTS}>View all</Link>
			</div>

			<SavedStories />
			<div className={CLASS + '-holder'} />
		</div>
	);
}
