import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import './Companies.css';

const TableRow = ({
	className,
	name,
	segment,
	region,
	industry,
}) => (
	<div className={className}>
		<div className="companies_row-cell">{name}</div>
		<div className="companies_row-cell">{segment}</div>
		<div className="companies_row-cell">{region}</div>
		<div className="companies_row-cell">{industry}</div>
	</div>
);

const Companies = () => {
	const [companies, setCompanies] = useState([]);

	// fetch the company data from the backend
	useEffect(() => {
		async function getCompanies() {
			const response = await fetch('/companies');
			const { message, data } = await response.json();
			if (message === 'success') {
				setCompanies(data);
			}
		}
		getCompanies();
	}, []);

	return (
		<div className="companies">
			<TableRow
				className="companies_header"
				name="Name"
				segment="Segment"
				region="Region"
				industry="Industry"
			/>
			{companies.map(company => (
				<Link
					className="companies_row_container"
					key={company.id}
					to={`/companies/${company.id}`}
				>
					<TableRow
						className="companies_row"
						{...company}
					/>
				</Link>
			))}
		</div>
	);
};

export default Companies;
