export const HOME = '/';

const STORY = '/story';
export const NEW_STORY = STORY + '/new';
export const STORY_ID = STORY + '/:id';
export const EDIT_STORY = STORY_ID + '/edit';

export const goToStory = id => STORY + `/${id}`;
export const editStory = id => STORY + `/${id}/edit`;

const USER = '/user';
export const USER_ID = USER + '/:id';
export const USER_STORIES = USER_ID + '/stories';

export const goToUser = id => USER + `/${id}`;
export const goToUserStories = id => USER + `/${id}/stories`;

export const FORGOT_PASSWORD = '/forgot-password';
export const RESET_PASSWORD = '/reset-password';
