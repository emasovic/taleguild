import React, {useState} from 'react';
import propTypes from 'prop-types';
import moment from 'moment';
import {Link} from 'react-router-dom';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';

import {goToUser} from 'lib/routes';

import FA from 'types/font_awesome';
import {COLOR} from 'types/button';
import {Toast} from 'types/toast';

import {createOrDeleteLike, createOrDeleteComment} from 'redux/story';
import {selectUser} from 'redux/user';
import {createOrDeleteSavedStory} from 'redux/saved_stories';
import {addToast} from 'redux/toast';

import IconButton from 'components/widgets/button/IconButton';
import Image from 'components/widgets/image/Image';
import UserAvatar from 'components/user/UserAvatar';
import ConfirmModal from 'components/widgets/modals/Modal';
import FloatingInput from 'components/widgets/input/FloatingInput';
import StoryDropdownButton from './widgets/StoryDropdownButton';

import './StoryItem.scss';

const CLASS = 'st-StoryItem';

export default function StoryItem({
	id,
	image,
	description,
	title,
	categories,
	likes,
	comments,
	author,
	createdDate,
	storypages,
	savedBy,
}) {
	const dispatch = useDispatch();
	const {loggedUser, op} = useSelector(
		state => ({
			loading: state.stories.loading,
			op: state.stories.op,
			loggedUser: selectUser(state),
		}),
		shallowEqual
	);

	const [isCommentsOpen, setIsCommentsOpen] = useState(false);
	const [isLikesOpen, setIsLikesOpen] = useState(false);
	const [isSavedOpen, setIsSavedOpen] = useState(false);
	const [comment, setComment] = useState('');

	const {data} = loggedUser;

	const handleComment = (e, commentId) => {
		e.preventDefault();
		if (comment.length >= 200) {
			return dispatch(
				addToast({...Toast.error('Comment needs to be less than 200 characters.')})
			);
		}
		dispatch(createOrDeleteComment({user: data.id, story: id, comment, id: commentId}));
		setComment('');
	};

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

	const renderCommentsContent = () => {
		return (
			<div className={CLASS + '-comments'}>
				<div className={CLASS + '-comments-posted'}>
					{comments.length ? (
						comments.map((item, key) => {
							const {user} = item;
							return (
								<Link
									to={goToUser(user.id)}
									key={key}
									className={CLASS + '-comments-posted-item'}
								>
									<UserAvatar user={user} />
									<div className={CLASS + '-comments-posted-item-user'}>
										<div className={CLASS + '-comments-posted-item-user-info'}>
											<span>{user.display_name || user.username}</span>
											<span>{moment(item.created_at).fromNow()}</span>
										</div>
										<span>{item.comment}</span>
										{data && user.id === data.id && (
											<IconButton
												color={COLOR.secondary}
												icon={FA.solid_times}
												disabled={op}
												onClick={e => handleComment(e, item.id)}
											/>
										)}
									</div>
								</Link>
							);
						})
					) : (
						<p>No Comments</p>
					)}
				</div>

				{data && (
					<div className={CLASS + '-comments-new'}>
						<UserAvatar user={data} />
						<div className={CLASS + '-comments-new-comment'}>
							<FloatingInput
								// rows={1}
								maxLength={200}
								type="textarea"
								value={comment}
								placeholder="Write a comment..."
								onChange={val => setComment(val)}
							/>
							<IconButton
								color={COLOR.secondary}
								loading={op}
								onClick={handleComment}
							>
								Post
							</IconButton>
						</div>
					</div>
				)}
			</div>
		);
	};

	const renderLikesContent = () => {
		return (
			<div className={CLASS + '-likes'}>
				{likes.length ? (
					likes.map((item, key) => {
						const {user} = item;
						return (
							<Link
								to={goToUser(user.id)}
								key={key}
								className={CLASS + '-likes-item'}
							>
								<UserAvatar user={user} />
								<span>{user.display_name || user.username}</span>
							</Link>
						);
					})
				) : (
					<p>No Likes</p>
				)}
			</div>
		);
	};

	const renderSavedContent = () => {
		return (
			<div className={CLASS + '-likes'}>
				{savedBy.length ? (
					savedBy.map((item, key) => {
						const {user} = item;
						return (
							<Link
								to={goToUser(user.id)}
								key={key}
								className={CLASS + '-likes-item'}
							>
								<UserAvatar user={user} />
								<span>{user.display_name || user.username}</span>
							</Link>
						);
					})
				) : (
					<p>No saves</p>
				)}
			</div>
		);
	};

	const renderCategories =
		categories && categories.length
			? categories.map(item => item.display_name).join(' | ')
			: null;

	let liked = false;
	let favourite = false;

	if (data) {
		liked = likes && likes.find(l => l.user.id === data.id || l.user === data.id);
		favourite = savedBy && savedBy.find(f => f.user.id === data.id || f.user === data.id);
	}

	const likeIcon = liked ? FA.solid_heart : FA.heart;
	const favouriteIcon = favourite ? FA.solid_bookmark : FA.bookmark;

	image = image ? image.formats.medium : image;

	return (
		<div className={CLASS}>
			{data && author.id === data.id && (
				<StoryDropdownButton story={{id, title, storypages}} />
			)}
			<Link to={goToUser(author.id)} className={CLASS + '-author'}>
				<UserAvatar user={author} />
				<div className={CLASS + '-author-info'}>
					<span>{author.display_name || author.username}</span>
					<span>{moment(createdDate).fromNow()}</span>
				</div>
			</Link>
			<div className={CLASS + '-description'}>{description}</div>
			<Link to={`/story/${id}`} className={CLASS + '-cover'}>
				<Image image={image} alt="cover" />
			</Link>

			<div className={CLASS + '-footer'}>
				<div className={CLASS + '-footer-title'}>
					<span>{title}</span>
					<span>{renderCategories}</span>
				</div>

				{data && (
					<div className={CLASS + '-footer-actions'}>
						<div className={CLASS + '-footer-actions-left'}>
							<IconButton
								outline
								active={!!liked}
								icon={likeIcon}
								onClick={e => handleLike(e, liked, id)}
							/>
							<IconButton
								outline
								icon={FA.comment}
								onClick={() => setIsCommentsOpen(true)}
							/>
						</div>
						<IconButton
							outline
							active={!!favourite}
							icon={favouriteIcon}
							onClick={e => handleFavourite(e, favourite, id)}
						/>
					</div>
				)}

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
					</div>

					{savedBy && (
						<span onClick={() => setIsSavedOpen(true)}>{savedBy.length} saves</span>
					)}
				</div>
			</div>
			{isLikesOpen && (
				<ConfirmModal
					isOpen={isLikesOpen}
					title={title}
					renderFooter={false}
					content={renderLikesContent()}
					onClose={() => setIsLikesOpen(false)}
				/>
			)}
			{isCommentsOpen && (
				<ConfirmModal
					isOpen={isCommentsOpen}
					title={title}
					renderFooter={false}
					content={renderCommentsContent()}
					onClose={() => setIsCommentsOpen(false)}
				/>
			)}
			{isSavedOpen && (
				<ConfirmModal
					isOpen={isSavedOpen}
					title={title}
					renderFooter={false}
					content={renderSavedContent()}
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
	storypages: propTypes.array,
	editMode: propTypes.bool,
	description: propTypes.string,
	title: propTypes.string,
	createdDate: propTypes.string,
	author: propTypes.object,
};
