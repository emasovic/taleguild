import React from 'react';

import {USER_STORIES_ARCHIVED} from 'lib/routes';

import {STORY_COMPONENTS} from 'types/story';
import {TEXT_TRASFORM} from 'types/typography';

import Link, {UNDERLINE} from 'components/widgets/link/Link';
import MobileWrapper from 'components/widgets/mobile-wrapper/MobileWrapper';

import RecentWork from 'views/dashboard/widgets/RecentWork';
import ArchivedStories from '../stories/ArchivedStories';

import './DraftStoriesPage.scss';

const CLASS = 'st-DraftStoriesPage';

export default function DraftStoriesPage() {
	return (
		<MobileWrapper className={CLASS}>
			<div className={CLASS + '-saved'}>
				<ArchivedStories shouldLoadMore={false} Component={STORY_COMPONENTS.list} />
				<Link to={USER_STORIES_ARCHIVED} underline={UNDERLINE.hover}>
					View all
				</Link>
			</div>
			<RecentWork
				shouldLoadMore
				title="Drafts"
				titleProps={{textTransform: TEXT_TRASFORM.uppercase}}
				placeholderProps={{
					subtitle:
						'Start writing your first story with our simple and clean text editor',
					buttonText: 'Write story now',
				}}
			/>

			<div className={CLASS + '-holder'} />
		</MobileWrapper>
	);
}
