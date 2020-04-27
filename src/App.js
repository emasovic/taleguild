import React, {useEffect} from 'react';
import {Route, BrowserRouter as Router, Switch} from 'react-router-dom';
import {useDispatch} from 'react-redux';

import {getUser} from './redux/userSlice';

import Nav from 'components/nav/Nav';
import Stories from 'components/stories/Stories';
import NewStory from 'components/stories/NewStory';
import Story from 'components/stories/Story';

function App() {
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(getUser());
	}, []);
	return (
		<Router>
			<Nav />
			<Switch>
				<Route exact path="/" component={Stories} />
				<Route path="/story/new" component={NewStory} />
				<Route path="/story/:id" component={Story} />
			</Switch>
		</Router>
	);
}

export default App;
