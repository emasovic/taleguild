export const HOME = '/';

export const toQuery = query => HOME + '?' + query;

const STORY = '/story';
export const NEW_STORY = STORY + '/new';
export const STORY_ID = STORY + '/:id';
export const WRITE_STORY = STORY_ID + '/write/:pageId';

export const goToStory = id => STORY + `/${id}`;
export const editStory = (id, pageId) => STORY + `/${id}/write/${pageId}`;

export const USER = '/user';
export const USER_SETTINGS = USER + '/settings';
export const USER_ID = USER + '/:id';
export const USER_STORIES_DRAFTS = USER + '/stories/drafts';
export const USER_STORIES_SAVED = USER + '/stories/saved';

export const goToUser = id => USER + `/${id}`;
export const goToUserStories = id => USER + `/${id}/stories`;

export const FORGOT_PASSWORD = '/forgot-password';
export const RESET_PASSWORD = '/reset-password';

export const REGISTER = '/register';
export const LOGIN = '/login';

export const DELETED_STORY = '/deleted-story';
