import React, {useState} from 'react';
import {Pagination, PaginationItem, PaginationLink} from 'reactstrap';

import './Pagination.scss';

const CLASS = 'st-Pagination';

const Pages = ({onClick, pages}) => {
	const [currentPage, setCurrentPage] = useState(1);

	const handleChange = page => {
		onClick(page - 1);
		setCurrentPage(page);
	};
	if (!pages) {
		return null;
	}

	pages = Array.from(Array(pages), (n, index) => index + 1);
	const prevPage = currentPage === 1 ? currentPage : currentPage - 1;
	const nextPage = currentPage === pages.length ? currentPage : currentPage + 1;
	return (
		<Pagination className={CLASS}>
			<PaginationItem>
				<PaginationLink previous onClick={() => handleChange(prevPage)} />
			</PaginationItem>
			{pages.map((item, key) => {
				return (
					<PaginationItem key={key} active={currentPage === item}>
						<PaginationLink onClick={() => handleChange(item)}>{item}</PaginationLink>
					</PaginationItem>
				);
			})}
			<PaginationItem>
				<PaginationLink next onClick={() => handleChange(nextPage)} />
			</PaginationItem>
		</Pagination>
	);
};

export default Pages;
