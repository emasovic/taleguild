export const HOME = '/';

export const FEED = '/feed';

const STORY = '/story';
const STORY_ID = STORY + '/:id';

export const NEW_STORY = STORY + '/new';
export const STORY_SLUG = STORY + '/:slug';
export const WRITE_STORY = STORY_ID + '/write/:pageId';

export const goToStory = slug => STORY + `/${slug}`;
export const editStory = (id, pageId) => STORY + `/${id}/write/${pageId}`;

export const USER = '/user';
export const USER_SETTINGS = USER + '/account/settings';
export const USER_ID = USER + '/:username';
export const USER_STORIES_ARCHIVED = USER + '/stories/archived';
export const USER_STORIES_DRAFTS = USER + '/stories/drafts';
export const USER_STORIES_SAVED = USER + '/stories/saved';

export const goToUser = username => USER + `/${username}`;
export const goToUserStories = username => USER + `/${username}/stories`;

export const FORGOT_PASSWORD = '/forgot-password';
export const RESET_PASSWORD = '/reset-password';
export const WELCOME = '/welcome';
export const REGISTRATION_SUCCESS = '/registration-success';

export const NOTIFICATIONS = '/notifications';

export const REGISTER = '/register';
export const LOGIN = '/login';

export const PROVIDER_LOGIN = '/connect/:provider';

export const DELETED_STORY = '/deleted-story';

export const GUILDATOR = '/guildatar';

export const MARKETPLACE = '/marketplace';
