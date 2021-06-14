import React, {useCallback, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';

import {goToUser} from 'lib/routes';

import FA from 'types/font_awesome';
import {Toast} from 'types/toast';
import {COLOR} from 'types/button';
import {DEFAULT_OP} from 'types/default';

import {loadComments, selectComments} from 'redux/comments';
import {selectUser} from 'redux/user';
import {addToast} from 'redux/toast';
import {createOrDeleteComment} from 'redux/story';

import ConfirmModal from 'components/widgets/modals/Modal';
import LoadMoreModal from 'components/widgets/loadmore/LoadMoreModal';
import FromNow from 'components/widgets/date-time/FromNow';
import IconButton from 'components/widgets/button/IconButton';
import TextArea from 'components/widgets/textarea/TextArea';

import Loader from 'components/widgets/loader/Loader';
import UserAvatar from 'views/user/UserAvatar';

function CommentsDialog({isOpen, title, onClose, storyId, className}) {
	const dispatch = useDispatch();
	const {comments, commentsOp, user, op, pages} = useSelector(
		state => ({
			comments: selectComments(state),
			user: selectUser(state),
			op: state.stories.op,
			commentsOp: state.comments.op,
			pages: state.comments.pages,
		}),
		shallowEqual
	);

	const [currentPage, setCurrentPage] = useState(1);
	const [comment, setComment] = useState('');

	const {data} = user;

	const renderContent = () => {
		if (op === DEFAULT_OP.loading) {
			return <Loader />;
		}
		return (
			<div className={className + '-comments'}>
				<LoadMoreModal
					onLoadMore={handleCount}
					loading={commentsOp === DEFAULT_OP.load_more}
					shouldLoad={pages > currentPage}
					id="storyComments"
					className={className + '-comments-posted'}
				>
					{comments.length ? (
						comments.map((item, key) => {
							const {user} = item;
							return (
								<Link
									to={goToUser(user.username)}
									key={key}
									className={className + '-comments-posted-item'}
								>
									<UserAvatar user={user} />
									<div className={className + '-comments-posted-item-user'}>
										<div
											className={
												className + '-comments-posted-item-user-info'
											}
										>
											<span>{user.display_name || user.username}</span>
											<FromNow date={item.created_at} />
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
				</LoadMoreModal>

				{data && (
					<div className={className + '-comments-new'}>
						<UserAvatar user={data} />
						<div className={className + '-comments-new-comment'}>
							<TextArea
								cols={34}
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

	const handleCount = useCallback(() => {
		dispatch(
			loadComments(
				{story: storyId, _start: currentPage * 10, _limit: 10},
				false,
				DEFAULT_OP.load_more
			)
		);
		setCurrentPage(currentPage + 1);
	}, [dispatch, currentPage, storyId]);

	const handleComment = (e, commentId) => {
		e.preventDefault();
		if (comment.length >= 200) {
			return dispatch(
				addToast({...Toast.error('Comment needs to be less than 200 characters.')})
			);
		}
		if (comment.trim().length <= 2 && !commentId) {
			return dispatch(
				addToast({...Toast.error('Comment needs to be more than 2 characters.')})
			);
		}
		dispatch(createOrDeleteComment({user: data.id, story: storyId, comment, id: commentId}));
		setComment('');
	};

	useEffect(() => {
		if (storyId) {
			dispatch(loadComments({story: storyId, _start: 0, _limit: 10}, true));
		}
	}, [dispatch, storyId]);

	return (
		<ConfirmModal
			isOpen={isOpen}
			title={title}
			renderFooter={false}
			content={renderContent()}
			onClose={onClose}
		/>
	);
}

CommentsDialog.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	title: PropTypes.string.isRequired,
	onClose: PropTypes.func.isRequired,
	storyId: PropTypes.number.isRequired,
	className: PropTypes.string,
};

export default CommentsDialog;
