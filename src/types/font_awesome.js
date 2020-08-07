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
	faImage as solidImage,
	faHome as solidHome,
	faCompass as solidCompass,
	faCoffee as solidCoffee,
} from '@fortawesome/free-solid-svg-icons';

import {faHeart, faComment, faBookmark, faCompass} from '@fortawesome/free-regular-svg-icons';

import {faFacebookF, faGoogle} from '@fortawesome/free-brands-svg-icons';

import {library} from '@fortawesome/fontawesome-svg-core';

const FA = {
	//BRAND ICONS
	brand_facebook_f: faFacebookF,
	brand_google: faGoogle,

	//REGULAR ICONS
	comment: faComment,
	heart: faHeart,
	bookmark: faBookmark,
	compass: faCompass,

	//SOLID ICONS
	solid_coffee: solidCoffee,
	solid_home: solidHome,
	solid_compass: solidCompass,
	solid_image: solidImage,
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
