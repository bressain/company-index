import React from 'react';
import {
	Routes,
	Route,
} from 'react-router-dom';
import Company from './Companies/Company'
import PageContainer from './PageContainer/PageContainer.js';
import Companies from './Companies/Companies.js';

const App = () => {
	return (
			<Routes>
				<Route path="/" element={<PageContainer />}>
					<Route index element={<Companies />} />
					<Route path="companies/:companyId" element={<Company />} />
					<Route path="companies" element={<Companies />} />
				</Route>
			</Routes>
	);
};

export default App;
