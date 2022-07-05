import React from 'react';
import { useLocation, Link, useParams } from 'react-router-dom'
import './Breadcrumbs.css';
import { useCompanies } from '../../../store'

const Breadcrumbs = () => {
	const location = useLocation();
	const { companyId } = useParams();
	const companies = useCompanies(state => state.companies)

	const crumbs = [];

	if (location.pathname === '/' || location.pathname.startsWith('/companies')) {
		crumbs.push({ name: 'Companies', destination: '/companies' })
	}
	if (companyId) {
		const company = companies[companyId]
		if (company) {
			crumbs.push({ name: company.name, destination: `/companies/${companyId}` })
		} else {
			crumbs.push({ name: 'Loading...', destination: `/companies/${companyId}` })
		}
	}

	return (
		<div className="breadcrumbs">
			<div className="breadcrumbs_crumb">/</div>
			{crumbs.map(crumb => (
				<div className="breadcrumbs_crumb" key={crumb.name}>
					<Link to={crumb.destination}>{crumb.name}</Link>
					/
				</div>
			))}
		</div>
	);
};

export default Breadcrumbs;