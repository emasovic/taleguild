import React, {useEffect} from 'react';
import {Route, BrowserRouter as Router} from 'react-router-dom';
import {useDispatch} from 'react-redux';

import {getUser} from './redux/userSlice';

import Nav from 'components/nav/Nav';
import Stories from 'components/stories/Stories';
import NewStory from 'components/stories/NewStory';

function App() {
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(getUser());
	}, []);
	return (
		<Router>
			<Nav />
			<Route exact path="/">
				<Stories />
			</Route>
			<Route path="/story/new">
				<NewStory />
			</Route>
		</Router>
	);
}

export default App;
