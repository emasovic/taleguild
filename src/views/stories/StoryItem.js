import React, {useState} from 'react';
import propTypes from 'prop-types';
import {useLocation} from 'react-router-dom';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';

import {goToUser} from 'lib/routes';

import FA from 'types/font_awesome';
import {TEXT_COLORS} from 'types/typography';

import {createOrDeleteLike} from 'redux/likes';
import {selectAuthUser} from 'redux/auth';
import {createOrDeleteSavedStory} from 'redux/savedStories';
import {navigateToQuery} from 'redux/application';

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
	savedBy,
	slug,
	keepArchived,
	selector,
}) {
	const dispatch = useDispatch();
	const location = useLocation();
	const {loggedUser} = useSelector(
		state => ({
			loading: state.stories.loading,
			loggedUser: selectAuthUser(state),
		}),
		shallowEqual
	);

	const [isCommentsOpen, setIsCommentsOpen] = useState(false);
	const [isLikesOpen, setIsLikesOpen] = useState(false);
	const [isSavedOpen, setIsSavedOpen] = useState(false);

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
				<StoryDropdownButton id={id} keepArchived={keepArchived} selector={selector} />
			)}
			<Link
				to={goToUser(author?.username)}
				underline={UNDERLINE.none}
				className={CLASS + '-author'}
			>
				<UserAvatar user={author} />
				<div className={CLASS + '-author-info'}>
					<Typography>{author?.display_name || author?.username}</Typography>
					<FromNow date={createdDate} />
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
							/>
						</>
					)}
				</div>

				<div className={CLASS + '-footer-stats'}>
					<div className={CLASS + '-footer-stats-left'}>
						{likes && (
							<Typography
								color={TEXT_COLORS.tertiary}
								onClick={() => setIsLikesOpen(true)}
							>
								{likes.length} likes
							</Typography>
						)}
						{comments && (
							<Typography
								color={TEXT_COLORS.tertiary}
								onClick={() => setIsCommentsOpen(true)}
							>
								{comments.length} comments
							</Typography>
						)}
						{views && (
							<Typography color={TEXT_COLORS.tertiary}>
								{views.length} views
							</Typography>
						)}
					</div>

					{savedBy && (
						<Typography
							color={TEXT_COLORS.tertiary}
							onClick={() => setIsSavedOpen(true)}
						>
							{savedBy.length} saves
						</Typography>
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
		</div>
	);
}

StoryItem.propTypes = {
	id: propTypes.number,
	image: propTypes.object,
	categories: propTypes.array,
	likes: propTypes.array,
	comments: propTypes.array,
	formats: propTypes.object,
	size: propTypes.string,
	description: propTypes.string,
	title: propTypes.string,
	createdDate: propTypes.string,
	author: propTypes.object,
	views: propTypes.array,
	savedBy: propTypes.array,
	slug: propTypes.string,
	keepArchived: propTypes.bool,
	selector: propTypes.func,
};
