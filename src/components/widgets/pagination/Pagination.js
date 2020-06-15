import React, {useState} from 'react';
import {Pagination, PaginationItem, PaginationLink} from 'reactstrap';

import './Pagination.scss';

const CLASS = 'st-Pagination';

const Pages = ({onClick, pages, prefix}) => {
	const [currentPage, setCurrentPage] = useState(1);

	const handleChange = page => {
		onClick(page - 1);
		setCurrentPage(page);
	};

	if (!pages || pages < 2) {
		return null;
	}

	const pagesNumber =
		currentPage === pages
			? Array.from(Array(pages), (n, index) => index + 1).slice(currentPage - 2, currentPage)
			: Array.from(Array(pages), (n, index) => index + 1).slice(
					currentPage - 1,
					currentPage + 1
			  );

	const prevPage = currentPage === 1 ? currentPage : currentPage - 1;
	const nextPage = currentPage === pages.length ? currentPage : currentPage + 1;
	return (
		<Pagination className={CLASS}>
			<PaginationItem>
				<PaginationLink previous onClick={() => handleChange(prevPage)} />
			</PaginationItem>
			{pagesNumber.map((item, key) => {
				return (
					<PaginationItem key={key} active={currentPage === item}>
						<PaginationLink onClick={() => handleChange(item)}>
							{prefix ? `${prefix} ${item}` : item}
						</PaginationLink>
					</PaginationItem>
				);
			})}
			<PaginationItem disabled={currentPage === pages}>
				<PaginationLink next onClick={() => handleChange(nextPage)} />
			</PaginationItem>
		</Pagination>
	);
};

export default Pages;
