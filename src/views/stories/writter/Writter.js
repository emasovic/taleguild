import React, {useRef, useMemo} from 'react';
import debounce from 'lodash.debounce';
import PropTypes from 'prop-types';

import {STORY_PAGE_OP} from 'types/story_page';
import {DEFAULT_OP} from 'types/default';

import TextEditor from 'components/widgets/text-editor/TextEditor';
import Loader from 'components/widgets/loader/Loader';
import {useDispatch} from 'react-redux';
import {toggleMobileNav} from 'redux/app';

export default function Writter({
	className,
	onCurrentChange,
	currentEditing,
	onStoryPage,
	onEndAt,
	onStartAt,
	published,
	archived,
	op,
}) {
	const editorRef = useRef(null);

	const dispatch = useDispatch();

	const displayMobileNav = () => dispatch(toggleMobileNav());

	const scrollToBottom = () => {
		const domSelection = window.getSelection();

		if (domSelection.anchorOffset) {
			const domRange = domSelection.getRangeAt(0);
			const rect = domRange.getBoundingClientRect();

			window.scrollTo({
				top: rect.top + window.pageYOffset - 200,
				left: 0,
				behavior: 'smooth',
			});
		}
	};

	const handleKeyDown = () => {
		scrollToBottom();
		onStartAt();
	};

	const _onStoryPage = useMemo(() => debounce((id, text) => onStoryPage(id, text), 3000), [
		onStoryPage,
	]);

	const handleEditPage = val => {
		const shouldAutoSave = !published || archived;
		const current = {
			...currentEditing,
			text: val,
		};

		onCurrentChange(current);
		shouldAutoSave && _onStoryPage(current.id, val);
	};

	if (op[STORY_PAGE_OP.create].loading || op[DEFAULT_OP.loading].loading) return <Loader />;

	return (
		<div className={className + '-writter'} ref={editorRef}>
			<TextEditor
				value={currentEditing.text}
				onChange={handleEditPage}
				onKeyUp={onEndAt}
				onKeyDown={handleKeyDown}
				onFocus={displayMobileNav}
				onBlur={displayMobileNav}
			/>
		</div>
	);
}

Writter.propTypes = {
	className: PropTypes.string,
	onCurrentChange: PropTypes.func,
	currentEditing: PropTypes.object,
	onStoryPage: PropTypes.func,
	onEndAt: PropTypes.func,
	onStartAt: PropTypes.func,
	published: PropTypes.bool,
	archived: PropTypes.bool,
	op: PropTypes.object,
};
