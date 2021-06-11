import React, {useState} from 'react';
import propTypes from 'prop-types';
import {Link, useLocation} from 'react-router-dom';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';

import {goToUser} from 'lib/routes';

import FA from 'types/font_awesome';

// import useCopyToClipboard from 'hooks/copy-to-clipboard';

import {createOrDeleteLike} from 'redux/story';
import {selectUser} from 'redux/user';
import {createOrDeleteSavedStory} from 'redux/savedStories';
import {navigateToQuery} from 'redux/application';

import IconButton from 'components/widgets/button/IconButton';
import Image from 'components/widgets/image/Image';
import FromNow from 'components/widgets/date-time/FromNow';
import StoryDropdownButton from './widgets/dropdown-button/StoryDropdownButton';

import UserAvatar from 'views/user/UserAvatar';

import SavedByDialog from './dialogs/SavesDialog';
import CommentsDialog from './dialogs/CommentsDialog';
import LikesDialog from './dialogs/LikesDialog';

import './StoryItem.scss';

const CLASS = 'st-StoryItem';

export default function StoryItem({
	id,
	image,
	formats,
	size,
	description,
	title,
	categories,
	likes,
	views,
	comments,
	author,
	createdDate,
	storypages,
	savedBy,
	slug,
}) {
	const dispatch = useDispatch();
	const location = useLocation();
	const {loggedUser} = useSelector(
		state => ({
			loading: state.stories.loading,

			loggedUser: selectUser(state),
		}),
		shallowEqual
	);

	const [isCommentsOpen, setIsCommentsOpen] = useState(false);
	const [isLikesOpen, setIsLikesOpen] = useState(false);
	const [isSavedOpen, setIsSavedOpen] = useState(false);
	// const [isShareOpen, setIsShareOpen] = useState(false);
	// const [isCopied, setIsCopied] = useCopyToClipboard(10000);

	const {data} = loggedUser;

	const handleLike = (e, liked, storyId) => {
		if (!data) {
			return null;
		}
		e.preventDefault();

		dispatch(createOrDeleteLike(liked, data && data.id, storyId));
	};

	const handleFavourite = (e, favourite, storyId) => {
		if (!data) {
			return null;
		}
		e.preventDefault();
		dispatch(createOrDeleteSavedStory(favourite, data && data.id, storyId));
	};

	const getStoriesByCategoryId = categoryId => {
		dispatch(navigateToQuery({categories: categoryId}, location));
	};

	// const renderShareContent = () => {
	// 	const copyUrl = process.env.REACT_APP_SHARE_URL + '/story/' + slug;
	// 	const buttonColor = isCopied ? COLOR.success : COLOR.primary;
	// 	const buttonLabel = isCopied ? 'Copied' : 'Copy URL';
	// 	return (
	// 		<div className={CLASS + '-share'}>
	// 			<FloatingInput value={copyUrl} label="Copy this URL to share story" disabled />
	// 			<IconButton color={buttonColor} onClick={() => setIsCopied(copyUrl)}>
	// 				{buttonLabel}
	// 			</IconButton>
	// 		</div>
	// 	);
	// };

	const renderCategories =
		categories && categories.length
			? categories.map((item, key) => {
					return (
						<span key={key} onClick={() => getStoriesByCategoryId(item.id)}>
							{item.display_name}
						</span>
					);
			  })
			: null;

	let liked = false;
	let favourite = false;

	if (data) {
		liked = likes && likes.find(l => l.user.id === data.id || l.user === data.id);
		favourite = savedBy && savedBy.find(f => f.user.id === data.id || f.user === data.id);
	}

	const likeIcon = liked ? FA.solid_heart : FA.heart;
	const favouriteIcon = favourite ? FA.solid_bookmark : FA.bookmark;

	return (
		<div className={CLASS}>
			{data && author.id === data.id && (
				<StoryDropdownButton story={{id, title, storypages}} />
			)}
			<Link to={goToUser(author.username)} className={CLASS + '-author'}>
				<UserAvatar user={author} />
				<div className={CLASS + '-author-info'}>
					<span>{author.display_name || author.username}</span>
					<FromNow date={createdDate} />
				</div>
			</Link>
			<div className={CLASS + '-description'}>{description}</div>
			<Link to={`/story/${slug}`} className={CLASS + '-cover'}>
				<Image image={image} formats={formats} size={size} alt="cover" />
			</Link>

			<div className={CLASS + '-footer'}>
				<Link to={`/story/${slug}`} className={CLASS + '-footer-title'}>
					<span>{title}</span>
				</Link>
				<div className={CLASS + '-footer-categories'}>{renderCategories}</div>
				<div className={CLASS + '-footer-actions'}>
					{data && (
						<>
							<div className={CLASS + '-footer-actions-left'}>
								<IconButton
									outline
									active={!!liked}
									icon={likeIcon}
									onClick={e => handleLike(e, liked, id)}
									aria-label="like"
								/>
								<IconButton
									outline
									icon={FA.comment}
									onClick={() => setIsCommentsOpen(true)}
									aria-label="comment"
								/>
								{/* <IconButton
									outline
									icon={FA.share_square}
									onClick={() => setIsShareOpen(true)}
								/> */}
							</div>
							<IconButton
								outline
								active={!!favourite}
								icon={favouriteIcon}
								onClick={e => handleFavourite(e, favourite, id)}
								aria-label="save"
							/>
						</>
					)}
				</div>

				<div className={CLASS + '-footer-stats'}>
					<div className={CLASS + '-footer-stats-left'}>
						{likes && (
							<span onClick={() => setIsLikesOpen(true)}>{likes.length} likes</span>
						)}
						{comments && (
							<span onClick={() => setIsCommentsOpen(true)}>
								{comments.length} comments
							</span>
						)}
						{views && <span>{views.length} views</span>}
					</div>

					{savedBy && (
						<span onClick={() => setIsSavedOpen(true)}>{savedBy.length} saves</span>
					)}
				</div>
			</div>
			{isLikesOpen && (
				<LikesDialog
					isOpen={isLikesOpen}
					title={title}
					className={CLASS}
					storyId={id}
					onClose={() => setIsLikesOpen(false)}
				/>
			)}
			{isCommentsOpen && (
				<CommentsDialog
					isOpen={isCommentsOpen}
					title={title}
					className={CLASS}
					storyId={id}
					onClose={() => setIsCommentsOpen(false)}
				/>
			)}
			{isSavedOpen && (
				<SavedByDialog
					className={CLASS}
					storyId={id}
					isOpen={isSavedOpen}
					title={title}
					onClose={() => setIsSavedOpen(false)}
				/>
			)}
			{/* {isShareOpen && (
				<ConfirmModal
					isOpen={isShareOpen}
					title="Copy URL"
					renderFooter={false}
					content={renderShareContent()}
					onClose={() => setIsShareOpen(false)}
				/>
			)} */}
		</div>
	);
}

StoryItem.propTypes = {
	id: propTypes.number,
	image: propTypes.object,
	categories: propTypes.array,
	likes: propTypes.array,
	comments: propTypes.array,
	storypages: propTypes.array,
	formats: propTypes.object,
	size: propTypes.string,
	description: propTypes.string,
	title: propTypes.string,
	createdDate: propTypes.string,
	author: propTypes.object,
	views: propTypes.array,
	savedBy: propTypes.array,
	slug: propTypes.string,
};
