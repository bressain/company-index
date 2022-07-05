import React, { useEffect } from 'react';
import { Link } from 'react-router-dom'
import './Companies.css';
import { useCompanies } from '../../store'

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
	const { companies, fetchCompanies, isCompaniesFetched } = useCompanies()

	// fetch the company data from the backend
	useEffect(() => {
		if (!isCompaniesFetched) {
			fetchCompanies()
		}
	}, [fetchCompanies, isCompaniesFetched]);

	return (
		<div className="companies">
			<TableRow
				className="companies_header"
				name="Name"
				segment="Segment"
				region="Region"
				industry="Industry"
			/>
			{Object.values(companies).map(company => (
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
