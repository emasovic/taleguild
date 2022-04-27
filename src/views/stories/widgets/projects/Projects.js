import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {useDispatch, useSelector} from 'react-redux';

import {createClassName} from 'lib/util';

import {selectAuthUser} from 'redux/auth';
import {loadProjects, selectProjectIds, selectProject} from 'redux/projects';
import {navigateToQuery} from 'redux/router';

import {useGetSearchParams} from 'hooks/getSearchParams';

import ImageContainer from 'components/widgets/image/Image';
import Typography from 'components/widgets/typography/Typography';
import IconButton from 'components/widgets/button/IconButton';

import ProjectsDialog from './ProjectsDialog';

import './Projects.scss';

const CLASS = 'st-Projects';

const ProjectItem = ({id}) => {
	const dispatch = useDispatch();
	const {image, name} = useSelector(state => selectProject(state, id));

	const handleProject = () => dispatch(navigateToQuery({project: id}));

	return (
		<div className={createClassName([CLASS, 'item'])} onClick={handleProject}>
			<ImageContainer image={image} />
			<Typography>{name}</Typography>
		</div>
	);
};

ProjectItem.propTypes = {
	id: PropTypes.number.isRequired,
};

function Projects({type}) {
	const dispatch = useDispatch();

	const {data} = useSelector(selectAuthUser);
	const projects = useSelector(selectProjectIds);
	const {project} = useGetSearchParams();

	const [isOpen, setIsOpen] = useState(false);
	const [selectedProject, setSelectedProject] = useState(null);

	const toggleDialog = () => setIsOpen(prevState => !prevState);

	const handleProject = () => dispatch(navigateToQuery({project: undefined}));

	useEffect(() => {
		data && dispatch(loadProjects({type, user: data.id}, true));
	}, [dispatch, data, type]);

	return (
		<div className={CLASS}>
			{!project ? (
				<>
					<IconButton onClick={toggleDialog}>Create project</IconButton>
					{projects.map(i => (
						<ProjectItem id={i} key={i} onEdit={setSelectedProject} />
					))}
				</>
			) : (
				<Typography onClick={handleProject}> Go back </Typography>
			)}

			{isOpen && (
				<ProjectsDialog
					isOpen={isOpen}
					type={type}
					id={selectedProject}
					onClose={toggleDialog}
				/>
			)}
		</div>
	);
}

Projects.propTypes = {
	type: PropTypes.string.isRequired,
};

export default Projects;
