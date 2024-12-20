import React, {useState} from 'react';
import propTypes from 'prop-types';
import {useDispatch, useSelector} from 'react-redux';

import {goToUser} from 'lib/routes';

import FA from 'types/font_awesome';
import {TEXT_COLORS} from 'types/typography';
import {DEFAULT_OP} from 'types/default';

import {createOrDeleteLike} from 'redux/likes';
import {selectAuthUser} from 'redux/auth';
import {createOrDeleteSavedStory} from 'redux/savedStories';
import {navigateToQuery} from 'redux/router';
import {selectStory} from 'redux/story';

import IconButton from 'components/widgets/button/IconButton';
import Image from 'components/widgets/image/Image';
import FromNow from 'components/widgets/date-time/FromNow';
import Link, {UNDERLINE} from 'components/widgets/link/Link';
import Typography from 'components/widgets/typography/Typography';
import StoryDropdownButton from './widgets/dropdown-button/StoryDropdownButton';

import UserAvatar from 'views/user/UserAvatar';

import SavedByDialog from './dialogs/SavedByDialog';
import CommentsDialog from './dialogs/CommentsDialog';
import LikesDialog from './dialogs/LikesDialog';

import './StoryItem.scss';

const CLASS = 'st-StoryItem';

function StoryItem({id, size, selector, keepArchived}) {
	selector = selector || selectStory;
	const dispatch = useDispatch();
	const {data} = useSelector(selectAuthUser);
	const {
		image,
		description,
		title,
		categories,
		likes,
		slug,
		user: author,
		publishedAt,
		saved_by: savedBy,
		views_count: viewsCount,
		comments_count: commentsCount,
		savedstories_count: savedByCount,
		likes_count: likesCount,
	} = useSelector(state => selector(state, id));
	const {op: likeOp} = useSelector(state => state.likes);
	const {op: savedStoriesOp} = useSelector(state => state.savedStories);

	const formats = image?.formats;

	const [isCommentsOpen, setIsCommentsOpen] = useState(false);
	const [isLikesOpen, setIsLikesOpen] = useState(false);
	const [isSavedOpen, setIsSavedOpen] = useState(false);

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
		dispatch(navigateToQuery({categories: categoryId}));
	};

	const renderCategories =
		categories && categories.length
			? categories.map((item, key) => {
					return (
						<Typography key={key} onClick={() => getStoriesByCategoryId(item.id)}>
							{item.display_name}
						</Typography>
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
			{author?.id === data?.id && (
				<StoryDropdownButton id={id} selector={selector} keepArchived={keepArchived} />
			)}
			<Link
				to={goToUser(author?.username)}
				underline={UNDERLINE.none}
				className={CLASS + '-author'}
			>
				<UserAvatar user={author} />
				<div className={CLASS + '-author-info'}>
					<Typography>{author?.display_name || author?.username}</Typography>
					<FromNow date={publishedAt} />
				</div>
			</Link>
			<div className={CLASS + '-description'}>{description}</div>
			<Link to={`/story/${slug}`} underline={UNDERLINE.none} className={CLASS + '-cover'}>
				<Image image={image} formats={formats} size={size} alt="cover" />
			</Link>

			<div className={CLASS + '-footer'}>
				<Link
					to={`/story/${slug}`}
					underline={UNDERLINE.none}
					className={CLASS + '-footer-title'}
				>
					<Typography>{title}</Typography>
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
									disabled={!!likeOp[DEFAULT_OP.create].loading}
								/>
								<IconButton
									outline
									icon={FA.comment}
									onClick={() => setIsCommentsOpen(true)}
									aria-label="comment"
								/>
							</div>
							<IconButton
								outline
								active={!!favourite}
								icon={favouriteIcon}
								onClick={e => handleFavourite(e, favourite, id)}
								aria-label="save"
								disabled={!!savedStoriesOp[DEFAULT_OP.create].loading}
							/>
						</>
					)}
				</div>

				<div className={CLASS + '-footer-stats'}>
					<div className={CLASS + '-footer-stats-left'}>
						<Typography
							color={TEXT_COLORS.tertiary}
							onClick={() => setIsLikesOpen(true)}
						>
							{likesCount} likes
						</Typography>

						<Typography
							color={TEXT_COLORS.tertiary}
							onClick={() => setIsCommentsOpen(true)}
						>
							{commentsCount} comments
						</Typography>

						<Typography color={TEXT_COLORS.tertiary}>{viewsCount} views</Typography>
					</div>

					<Typography color={TEXT_COLORS.tertiary} onClick={() => setIsSavedOpen(true)}>
						{savedByCount} saves
					</Typography>
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
		</div>
	);
}

StoryItem.propTypes = {
	id: propTypes.number,
	size: propTypes.string,
	selector: propTypes.func,
	keepArchived: propTypes.bool,
};

export default StoryItem;
