import React, {useState} from 'react';
import {Nav, NavItem, NavLink} from 'reactstrap';
import {Link} from 'react-router-dom';
import {useSelector} from 'react-redux';

import {USER_STORIES_SAVED, goToUser, USER_STORIES_DRAFTS} from 'lib/routes';

import {STORY_COMPONENTS} from 'types/story';

import {selectUser} from 'redux/user';

import MyStories from 'components/user/stories/MyStories';
import SavedStories from 'components/user/stories/SavedStories';
import DraftStories from 'components/user/stories/DraftStories';

import './StoryTabs.scss';

const CLASS = 'st-StoryTabs';

const STORY_TABS = {
	my_stories: 'my_stories',
	saved_stories: 'saved_stories',
	draft_stories: 'draft_stories',
};

const COMPONENTS = {
	[STORY_TABS.my_stories]: MyStories,
	[STORY_TABS.saved_stories]: SavedStories,
	[STORY_TABS.draft_stories]: DraftStories,
};

const GO_TO = {
	// [STORY_TABS.my_stories]: USER_STORIES_SAVED,
	[STORY_TABS.saved_stories]: USER_STORIES_SAVED,
	[STORY_TABS.draft_stories]: USER_STORIES_DRAFTS,
};

export default function StoryTabs() {
	const [activeTab, setActiveTab] = useState(STORY_TABS.my_stories);
	const {data} = useSelector(selectUser);
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
				</Nav>
				<Component shouldLoadMore={false} Component={STORY_COMPONENTS.list} />
				<Link to={GO_TO[activeTab] || goToUser(data && data.id)}>View all</Link>
			</div>
		</div>
	);
}
