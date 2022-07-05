const express = require('express');
const bodyParser = require('body-parser')
const app = express();
app.use(bodyParser.json())
const port = 8080;
const db = require('./db');

/**
 * GET /companies
 * Fetches all companies in the database
 */
app.get('/companies', (req, res) => {
	const sql = `
		SELECT * FROM companies;
	`;
	const params = [];

	db.all(sql, params, (err, rows) => {
		if (err) {
			res.status(400).json({
				error: err.message
			});
			return;
		}
		
		res.json({
			message: 'success',
			data: rows
		});
	});
});

app.get('/companies/:companyId', (req, res) => {
	const query = `
		SELECT c.*,
		  d.name as department, d.id as department_id,
		  e.id as employee_id, e.name as employee, e.avatar, e.title, e.country
		FROM companies c
		  JOIN departments d on d.company_id = c.id
		  JOIN employees e on e.department_id = d.id
		WHERE c.id = $companyId;
	`

	db.all(query, { $companyId: req.params.companyId }, (err, rows) => {
		if (err) {
			res.status(400).json({ error: err.message })
			return
		}

		const company = serializeCompany(rows)
		if (!company) {
			res.status(404).json({ error: `Company ${req.params.companyId} does not exist` })
			return
		}

		res.json({ message: 'success', data: company })
	})
})

function serializeCompany(companyData) {
	if (!companyData.length)
		return null

	return {
		id: companyData[0].id,
		name: companyData[0].name,
		region: companyData[0].region,
		industry: companyData[0].industry,
		segment: companyData[0].segment,
		departments: companyData.reduce((departments, row) => {
			const employee = {
				id: row.employee_id,
				name: row.employee,
				avatar: row.avatar,
				title: row.title,
				country: row.country
			}
			if (departments[row.department_id]) {
				departments[row.department_id].employees.push(employee)
			} else {
				departments[row.department_id] = {
					id: row.department_id,
					name: row.department,
					employees: [employee]
				}
			}
			return departments
		}, {})
	}
}

app.patch('/companies', (req, res) => {
	if (!req.body.name || !req.body.companyId) {
		res.status(400).json({ error: 'Invalid request' })
		return
	}

	const statement = `
		UPDATE companies SET name = $name WHERE id = $companyId;
	`
	const params = {
		$name: req.body.name,
		$companyId: req.body.companyId
	}
	db.run(statement, params, err => {
		if (err) {
			res.status(400).json({ error: err })
		} else {
			res.status(200)
		}
	})
})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
});