import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {Input} from 'reactstrap';
import Fullscreen from 'react-full-screen';

import FA from 'types/font_awesome';
import {editStory} from 'lib/routes';

import {loadStory, selectStory, createComment} from 'redux/story';
import {selectUser} from 'redux/user';

import TextViewer from 'components/widgets/text-editor/TextViewer';
import Loader from 'components/widgets/loader/Loader';
import Image from 'components/widgets/image/Image';
import IconButton from 'components/widgets/button/IconButton';

import './Story.scss';

const CLASS = 'st-Story';

export default function Story(props) {
	const {params} = props.match;
	const dispatch = useDispatch();
	const {story, loading, loggedUser} = useSelector(
		state => ({
			story: selectStory(state, params.id),
			loading: state.stories.loading,
			loggedUser: selectUser(state),
		}),
		shallowEqual
	);

	const {data} = loggedUser;

	const [isFull, setIsFull] = useState(false);
	const [comment, setComment] = useState('');

	const createNewComment = () => {
		dispatch(createComment({user: data.id, story: story.id, comment}));
		setComment('');
	};

	useEffect(() => {
		dispatch(loadStory(params.id));
	}, [dispatch, params.id]);

	if (loading || !story) {
		return (
			<div className={CLASS}>
				<Loader />
			</div>
		);
	}

	const {image, user, comments} = story;

	return (
		<div className={CLASS}>
			<div className={`${CLASS}-fullscreen`}>
				{data && user.id === data.id && (
					<IconButton icon={FA.pencil} href={editStory(story.id)} />
				)}
				<IconButton icon={FA.arrows_alt} onClick={() => setIsFull(true)} />
			</div>

			<Fullscreen enabled={isFull} onChange={isFull => setIsFull(isFull)}>
				<div className={`${CLASS}-header`}>
					<Image image={image} />
					<div className={`${CLASS}-header-author`}>
						<h3>{story.title}</h3>
						<span>{user.username}</span>
					</div>
				</div>

				<TextViewer value={story.text} />
			</Fullscreen>

			<div className={`${CLASS}-comments`}>
				{comments.length
					? comments.map((item, key) => {
							return (
								<div key={key} className={`${CLASS}-comments-comment`}>
									<span>{item.user.username}</span>
									<Input type="textarea" value={item.comment} disabled />
								</div>
							);
					  })
					: null}

				{data && (
					<div className={`${CLASS}-comments-newComment`}>
						<Input
							rows={5}
							type="textarea"
							value={comment}
							placeholder="Komentar ..."
							onChange={e => setComment(e.target.value)}
						/>
						<IconButton onClick={createNewComment}>Postavite komentar</IconButton>
					</div>
				)}
			</div>
		</div>
	);
}
