import {
	faTrash as solidTrash,
	faArchive as solidArchive,
	faArrowsAlt as solidArrowsAlt,
	faPen as solidPen,
	faCog as solidCog,
	faTimes as solidTimes,
	faHeart as solidHeart,
	faBookmark as solidBookmark,
	faSearch as solidSearch,
	faEllipsisH as soildElipsisH,
	faPlus as solidPlus,
	faBars as solidBars,
	faBold as solidBold,
	faItalic as solidItalic,
	faUnderline as solidUnderLine,
	faHeading as solidHeading,
	faEye as solidEye,
} from '@fortawesome/free-solid-svg-icons';

import {faHeart, faComment, faBookmark} from '@fortawesome/free-regular-svg-icons';

import {library} from '@fortawesome/fontawesome-svg-core';

const FA = {
	//REGULAR ICONS

	comment: faComment,
	heart: faHeart,
	bookmark: faBookmark,

	//SOLID ICONS
	solid_eye: solidEye,
	solid_italic: solidItalic,
	solid_underline: solidUnderLine,
	solid_heading: solidHeading,
	solid_bold: solidBold,
	solid_bars: solidBars,
	solid_plus: solidPlus,
	soild_search: solidSearch,
	solid_bookmark: solidBookmark,
	solid_heart: solidHeart,
	solid_archive: solidArchive,
	solid_trash: solidTrash,
	solid_arrows_alt: solidArrowsAlt,
	solid_pencil: solidPen,
	solid_cog: solidCog,
	solid_times: solidTimes,
	soild_elipsis_h: soildElipsisH,
};

library.add({...FA});

export default FA;
