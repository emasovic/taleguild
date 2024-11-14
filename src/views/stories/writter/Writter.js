import React, {useMemo, useEffect, useCallback} from 'react';
import debounce from 'lodash.debounce';
import PropTypes from 'prop-types';
import {useDispatch} from 'react-redux';

import {STORY_PAGE_OP} from 'types/story_page';
import {DEFAULT_OP} from 'types/default';

import {toggleMobileNav} from 'redux/app';

import TextEditor from 'components/widgets/text-editor/TextEditor';
import Loader from 'components/widgets/loader/Loader';

import useFocus from './useFocus';
export default function Writter({className, pages, pageId, onStoryPage, published, archived, op}) {
	const dispatch = useDispatch();

	const [handleStartAt, handleEndAt] = useFocus();

	const page = pages.find(p => p.id === Number(pageId));
	const displayLoader =
		op[STORY_PAGE_OP.create].loading || op[DEFAULT_OP.loading].loading || !page;

	const displayMobileNav = useCallback(displayNav => dispatch(toggleMobileNav(displayNav)), [
		dispatch,
	]);

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
		handleStartAt();
	};

	const _onStoryPage = useMemo(() => debounce((id, text) => onStoryPage(id, text), 3000), [
		onStoryPage,
	]);

	const handleEditPage = val => {
		const shouldAutoSave = !published || archived;

		shouldAutoSave && _onStoryPage(page.id, val);
	};

	useEffect(() => {
		displayMobileNav(false);

		return () => displayMobileNav(true);
	}, [displayMobileNav]);

	if (displayLoader) return <Loader />;

	return (
		<div className={className + '-writter'}>
			<TextEditor
				initialValue={page.text}
				onChange={handleEditPage}
				onKeyUp={handleEndAt}
				onKeyDown={handleKeyDown}
			/>
		</div>
	);
}

Writter.propTypes = {
	className: PropTypes.string,
	pages: PropTypes.array.isRequired,
	pageId: PropTypes.string.isRequired,
	onStoryPage: PropTypes.func,
	published: PropTypes.bool,
	archived: PropTypes.bool,
	op: PropTypes.object,
};
