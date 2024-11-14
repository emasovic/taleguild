import React, {useCallback, useEffect} from 'react';
import PropTypes from 'prop-types';
import {useDispatch, useSelector} from 'react-redux';
import {useFormik} from 'formik';
import * as Yup from 'yup';

import {goToUser} from 'lib/routes';

import FA from 'types/font_awesome';
import {COLOR} from 'types/button';
import {DEFAULT_PAGINATION, DEFAULT_OP} from 'types/default';

import {loadComments, selectComments} from 'redux/comments';
import {selectAuthUser} from 'redux/auth';
import {createOrDeleteComment} from 'redux/comments';

import ConfirmModal from 'components/widgets/modals/Modal';
import LoadMore from 'components/widgets/loadmore/LoadMore';
import FromNow from 'components/widgets/date-time/FromNow';
import IconButton from 'components/widgets/button/IconButton';
import TextArea from 'components/widgets/textarea/TextArea';

import UserAvatar from 'views/user/UserAvatar';
import Link, {UNDERLINE} from 'components/widgets/link/Link';
import Typography from 'components/widgets/typography/Typography';

const validationSchema = Yup.object().shape({
	comment: Yup.string()
		.min(2, 'Too Short!')
		.max(250, 'Too Long!')
		.required('Required'),
});
function CommentsDialog({isOpen, title, onClose, storyId, className}) {
	const dispatch = useDispatch();

	const comments = useSelector(selectComments);
	const {op, total} = useSelector(state => state.comments);
	const {data} = useSelector(selectAuthUser);

	const handleSubmit = val => {
		dispatch(
			createOrDeleteComment({user: data.id, story: storyId, comment: val.comment, id: val.id})
		);
		!val.id && resetForm();
	};

	const {values, errors, dirty, handleSubmit: formikSubmit, resetForm, handleChange} = useFormik({
		validationSchema,
		enableReinitialize: true,
		validateOnChange: false,
		initialValues: {
			comment: '',
		},
		onSubmit: handleSubmit,
	});

	const renderContent = () => {
		return (
			<div className={className + '-comments'}>
				<LoadMore
					onLoadMore={() => handleLoadComments(DEFAULT_OP.load_more, comments.length)}
					loading={op[DEFAULT_OP.loading].loading || op[DEFAULT_OP.load_more].loading}
					showItems={op[DEFAULT_OP.loading].success}
					shouldLoad={total > comments.length}
					isModal
					total={total}
					NoItemsComponent={() => <Typography>No comments</Typography>}
					id="storyComments"
					className={className + '-comments-posted'}
				>
					{comments.map((item, key) => {
						const {user} = item;
						return (
							<Link
								to={goToUser(user.username)}
								key={key}
								className={className + '-comments-posted-item'}
								underline={UNDERLINE.hover}
							>
								<UserAvatar user={user} />
								<div className={className + '-comments-posted-item-user'}>
									<div className={className + '-comments-posted-item-user-info'}>
										<span>{user.display_name || user.username}</span>
										<FromNow date={item.createdAt} />
									</div>
									<span>{item.comment}</span>
									{data && user.id === data.id && (
										<IconButton
											color={COLOR.secondary}
											icon={FA.solid_times}
											disabled={op[DEFAULT_OP.delete].loading}
											onClick={e => {
												e.preventDefault();
												handleSubmit({id: item.id});
											}}
										/>
									)}
								</div>
							</Link>
						);
					})}
				</LoadMore>

				{data && (
					<form onSubmit={formikSubmit}>
						<div className={className + '-comments-new'}>
							<UserAvatar user={data} />
							<div className={className + '-comments-new-comment'}>
								<TextArea
									cols={34}
									name="comment"
									value={values.comment}
									placeholder="Write a comment..."
									wholeEvent
									onChange={handleChange}
									errorMessage={errors.comment}
									invalid={!!errors.comment}
								/>
								<IconButton
									type="submit"
									color={COLOR.secondary}
									loading={
										op[DEFAULT_OP.loading].loading ||
										op[DEFAULT_OP.load_more].loading
									}
									disabled={!dirty}
								>
									Post
								</IconButton>
							</div>
						</div>
					</form>
				)}
			</div>
		);
	};

	const handleLoadComments = useCallback(
		(op, start) => {
			storyId &&
				dispatch(
					loadComments(
						{
							filters: {story: storyId},
							sort: ['createdAt:ASC'],
							pagination: {
								...DEFAULT_PAGINATION,
								start,
							},
						},
						op
					)
				);
		},
		[dispatch, storyId]
	);

	useEffect(() => handleLoadComments(undefined, 0), [handleLoadComments]);

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
	title: PropTypes.string,
	onClose: PropTypes.func.isRequired,
	storyId: PropTypes.number.isRequired,
	className: PropTypes.string,
};

export default CommentsDialog;
