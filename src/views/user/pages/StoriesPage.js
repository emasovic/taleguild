import React from 'react';
import PropTypes from 'prop-types';

import {isMobile} from 'lib/util';

import {STORY_COMPONENTS} from 'types/story';

import MobileWrapper from 'components/widgets/mobile-wrapper/MobileWrapper';

import './StoriesPage.scss';

const CLASS = 'st-StoriesPage';

function StoriesPage({MainComponent, mainComponentProps, SideComponent, sideComponentProps}) {
	return (
		<MobileWrapper className={CLASS}>
			{!isMobile && (
				<div className={CLASS + '-side'}>
					<SideComponent
						shouldLoadMore={false}
						Component={STORY_COMPONENTS.list}
						{...sideComponentProps}
					/>
				</div>
			)}
			<MainComponent {...mainComponentProps} />
			{!isMobile && <div className={CLASS + '-holder'} />}
		</MobileWrapper>
	);
}

StoriesPage.defaultProps = {
	mainComponentProps: {},
	sideComponentProps: {},
};

StoriesPage.propTypes = {
	MainComponent: PropTypes.func,
	mainComponentProps: PropTypes.object,
	SideComponent: PropTypes.func,
	sideComponentProps: PropTypes.object,
};

export default StoriesPage;
