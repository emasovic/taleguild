import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector, shallowEqual} from 'react-redux';
import {useHistory, useParams} from 'react-router-dom';
import {DropdownItem} from 'reactstrap';

import {Toast} from 'types/toast';
import {COLOR} from 'types/button';
import {DEFAULT_STORYPAGE_DATA} from 'types/story';
import FA from 'types/font_awesome';

import {
	createOrUpdateStory,
	selectStory,
	loadStory,
	deleteStoryPage,
	createOrUpdateStoryPage,
	STORY_OP,
} from '../../redux/story';
import {selectUser} from '../../redux/user';
import {addToast} from 'redux/toast';

import {useDebounce} from 'hooks/debounce';

import CategoryPicker from 'components/widgets/pickers/category/CategoryPicker';
import DropdownButton from 'components/widgets/button/DropdownButton';
import FloatingInput from '../widgets/input/FloatingInput';
import TextEditor from '../widgets/text-editor/TextEditor';
import IconButton from '../widgets/button/IconButton';
import Uploader from '../widgets/uploader/Uploader';
import ConfirmModal from '../widgets/modals/Modal';

import StoryPagePicker from './widgets/StoryPagePicker';

import './StoryWriter.scss';

const CLASS = 'st-StoryWriter';

export default function StoryWriter() {
	const dispatch = useDispatch();
	const params = useParams();
	const history = useHistory();

	const {story, user, op} = useSelector(
		state => ({
			story: selectStory(state, params.id),
			op: state.stories.op,
			user: selectUser(state),
		}),
		shallowEqual
	);

	const {data} = user;

	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [category, setCategory] = useState([]);
	const [image, setImage] = useState(null);
	const [pages, setPages] = useState([]);
	const [selectedPage, setSelectedPage] = useState(0);
	const [published, setPublished] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	let currentEditing = pages[selectedPage];

	const debouncedSearchTerm = useDebounce(currentEditing && currentEditing.text, 3000);

	const validate = () => {
		const errors = [];

		title.length <= 3 && errors.push('Title too short! \n');
		!category.length && errors.push('You must select category!');
		category.length > 2 && errors.push('You can select maximum 2 categories!');
		description.length <= 3 && errors.push('Description too short! \n');

		if (errors.length) {
			return dispatch(addToast(Toast.error(errors)));
		}

		return true;
	};

	const handleStoryPage = (id, text) => {
		dispatch(
			createOrUpdateStoryPage(
				{
					story: story && story.id,
					id,
					text: text || DEFAULT_STORYPAGE_DATA,
				},
				history
			)
		);
	};

	const handleEditPage = val => {
		currentEditing = {
			...currentEditing,
			text: val,
		};
		let updatedPages = [...pages];
		updatedPages[selectedPage] = currentEditing;
		setPages(updatedPages);
	};

	const create = () => {
		if (validate()) {
			const payload = {
				id: story && story.id,
				title,
				storypages: pages.map(item => item.id),
				published,
				image: image && image.id,
				user: data && data.id,
				description,
				categories: category.length && category.map(item => item.value),
			};

			dispatch(createOrUpdateStory(payload, history));
		}
	};

	useEffect(() => {
		dispatch(loadStory(params.id));
	}, [dispatch, params.id]);

	useEffect(() => {
		if (story) {
			setTitle(story.title || '');
			setDescription(story.description || '');
			setCategory(story.categories.map(item => ({label: item.name, value: item.id})));
			setImage(story.image);
			setPublished(story.published || false);
			setPages(story.storypages.map(item => ({...item, text: JSON.parse(item.text)})));
		}
	}, [story]);

	useEffect(() => {
		if (pages && pages.length) {
			let index = pages.findIndex(item => item.id === Number(params.pageId));
			index = index < 0 ? 0 : index;
			setSelectedPage(index);
		}
	}, [pages, params.pageId]);

	useEffect(() => {
		if (debouncedSearchTerm) {
			handleStoryPage(currentEditing.id, currentEditing.text);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedSearchTerm]);

	const renderContent = () => {
		return (
			<>
				<FloatingInput
					placeholder="Type title of your story here..."
					label="Title of story"
					value={title}
					onChange={val => setTitle(val)}
				/>
				<CategoryPicker
					placeholder="Pick categories"
					label="Categories"
					isMulti
					onChange={setCategory}
					value={category}
				/>
				<FloatingInput
					rows={5}
					label="Story description"
					type="textarea"
					value={description}
					placeholder="Type description of your story here..."
					onChange={e => setDescription(e.target.value)}
				/>
				<Uploader
					onUploaded={setImage}
					uploadlabel="Upload cover image"
					onRemove={() => setImage(null)}
					files={image}
				/>
			</>
		);
	};

	return (
		<div className={CLASS}>
			<FloatingInput
				placeholder="Type title of your story here..."
				value={title}
				onChange={val => setTitle(val)}
			/>
			<div className={CLASS + '-publish'}>
				<StoryPagePicker
					pages={pages}
					onChange={val => setSelectedPage(val.index)}
					onNewPageClick={() => handleStoryPage(undefined)}
					value={selectedPage}
				/>
				<IconButton icon={FA.solid_eye} color={COLOR.secondary} />
				<DropdownButton>
					<DropdownItem
						disabled={op === STORY_OP.saving_storypage}
						onClick={() => handleStoryPage(currentEditing.id, currentEditing.text)}
					>
						Update page
					</DropdownItem>
					<DropdownItem divider />
					<DropdownItem
						disabled={op === STORY_OP.saving_storypage}
						onClick={() => dispatch(deleteStoryPage(story.id, currentEditing.id))}
					>
						Remove page
					</DropdownItem>
				</DropdownButton>
				<div>
					<IconButton
						color={COLOR.secondary}
						disabled={op === STORY_OP.saving_storypage}
						onClick={() => setIsOpen(true)}
					>
						Publish
					</IconButton>
				</div>
			</div>

			{currentEditing && <TextEditor value={currentEditing.text} onChange={handleEditPage} />}

			{isOpen && (
				<ConfirmModal
					isOpen={isOpen}
					onClose={() => setIsOpen(false)}
					onSubmit={create}
					content={renderContent()}
					title="Publishing"
					renderFooter
					cancelLabel="Back to edit"
					confirmLabel="Publish my story"
				/>
			)}
		</div>
	);
}
