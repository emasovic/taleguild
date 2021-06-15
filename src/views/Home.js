import React from 'react';

import {DEFAULT_CRITERIA} from 'types/story';

import Explore from './Explore';

export default function Home() {
	const criteria = {...DEFAULT_CRITERIA, relevant: true};

	return <Explore criteria={criteria} />;
}
