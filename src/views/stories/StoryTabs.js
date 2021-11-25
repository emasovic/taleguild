import React, {useState} from 'react';
import {Nav, NavItem, NavLink} from 'reactstrap';
import {useSelector} from 'react-redux';

import {USER_STORIES_SAVED, goToUser, USER_STORIES_DRAFTS, USER_STORIES_ARCHIVED} from 'lib/routes';

import {STORY_COMPONENTS} from 'types/story';

import {selectAuthUser} from 'redux/auth';

import MyStories from 'views/user/stories/MyStories';
import SavedStories from 'views/user/stories/SavedStories';
import DraftStories from 'views/user/stories/DraftStories';
import ArchivedStories from 'views/user/stories/ArchivedStories';

import Link, {UNDERLINE} from 'components/widgets/link/Link';

import './StoryTabs.scss';

const CLASS = 'st-StoryTabs';

const STORY_TABS = {
	my_stories: 'my_stories',
	saved_stories: 'saved_stories',
	draft_stories: 'draft_stories',
	archived_stories: 'archived_stories',
};

const COMPONENTS = {
	[STORY_TABS.my_stories]: MyStories,
	[STORY_TABS.saved_stories]: SavedStories,
	[STORY_TABS.draft_stories]: DraftStories,
	[STORY_TABS.archived_stories]: ArchivedStories,
};

const GO_TO = {
	// [STORY_TABS.my_stories]: USER_STORIES_SAVED,
	[STORY_TABS.saved_stories]: USER_STORIES_SAVED,
	[STORY_TABS.draft_stories]: USER_STORIES_DRAFTS,
	[STORY_TABS.archived_stories]: USER_STORIES_ARCHIVED,
};

export default function StoryTabs() {
	const [activeTab, setActiveTab] = useState(STORY_TABS.my_stories);
	const {data} = useSelector(selectAuthUser);
	const Component = COMPONENTS[activeTab];

	if (!data) {
		return null;
	}

	return (
		<div className={CLASS}>
			<div className={CLASS + '-tabs'}>
				<Nav>
					<NavItem onClick={() => setActiveTab(STORY_TABS.my_stories)}>
						<NavLink href="#" active={activeTab === STORY_TABS.my_stories}>
							My stories
						</NavLink>
					</NavItem>
					<NavItem onClick={() => setActiveTab(STORY_TABS.saved_stories)}>
						<NavLink href="#" active={activeTab === STORY_TABS.saved_stories}>
							Saved stories
						</NavLink>
					</NavItem>
					<NavItem onClick={() => setActiveTab(STORY_TABS.draft_stories)}>
						<NavLink href="#" active={activeTab === STORY_TABS.draft_stories}>
							Drafts
						</NavLink>
					</NavItem>
					<NavItem onClick={() => setActiveTab(STORY_TABS.archived_stories)}>
						<NavLink href="#" active={activeTab === STORY_TABS.archived_stories}>
							Archived stories
						</NavLink>
					</NavItem>
				</Nav>
				<Component shouldLoadMore={false} Component={STORY_COMPONENTS.list} />
				<Link
					to={GO_TO[activeTab] || goToUser(data && data.username)}
					underline={UNDERLINE.hover}
				>
					View all
				</Link>
			</div>
		</div>
	);
}
