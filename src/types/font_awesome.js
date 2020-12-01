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
	faBoxOpen as solidBoxOpen,
	faDragon as solidDragon,
	faUserAstronaut as solidUserAstronaut,
	faScroll as solidScroll,
	faBook as solidBook,
	faCar as solidCar,
	faGhost as solidGhost,
	faLaughBeam as solidLaughBeam,
	faPenNib as solidPenNib,
	faSkull as solidSkull,
	faMask as solidMask,
	faSadTear as solidSadTear,
	faHatWizard as solidHatWizard,
	faLandmark as solidLandmark,
	faBan as solidBan,
	faBookReader as solidBookReader,
	faChessRook as solidChessRook,
	faTheaterMasks as solidTheaterMasks,
	faUserSecret as solidUserSecret,
	faLightbulb as solidLightbulb,
	faBaby as solidBaby,
	faFeather as solidFeather,
	faClipboardCheck as solidClipboardCheck,
} from '@fortawesome/free-solid-svg-icons';

import {
	faHeart,
	faComment,
	faBookmark,
	faCompass,
	faClipboard,
} from '@fortawesome/free-regular-svg-icons';

import {faFacebookF, faGoogle, faJediOrder} from '@fortawesome/free-brands-svg-icons';

import {library} from '@fortawesome/fontawesome-svg-core';

const FA = {
	//BRAND ICONS
	brand_facebook_f: faFacebookF,
	brand_google: faGoogle,
	brand_jedi: faJediOrder,

	//REGULAR ICONS
	comment: faComment,
	heart: faHeart,
	bookmark: faBookmark,
	compass: faCompass,
	clipboard: faClipboard,

	//SOLID ICONS
	solid_box_open: solidBoxOpen,
	solid_dragon: solidDragon,
	solid_user_astronaut: solidUserAstronaut,
	solid_scroll: solidScroll,
	solid_book: solidBook,
	solid_car: solidCar,
	solid_ghost: solidGhost,
	solid_laugh_beam: solidLaughBeam,
	solid_pen_nib: solidPenNib,
	solid_skull: solidSkull,
	solid_mask: solidMask,
	solid_sad_tear: solidSadTear,
	solid_hat_wizard: solidHatWizard,
	solid_landmark: solidLandmark,
	solid_ban: solidBan,
	solid_book_reader: solidBookReader,
	solid_chess_rook: solidChessRook,
	solid_theater_masks: solidTheaterMasks,
	solid_user_secret: solidUserSecret,
	solid_lightbulb: solidLightbulb,
	solid_baby: solidBaby,
	solid_feather: solidFeather,
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
	solid_clipboard_check: solidClipboardCheck,
};

library.add({...FA});

export default FA;
