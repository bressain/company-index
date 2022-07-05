import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDebouncedCallback } from 'use-debounce'
import './Company.css'
import { useCompanies } from '../../store'

const Employee = ({ employee }) => {
  return (
    <li>
      <img src={employee.avatar} alt="" />
      <div>{employee.name}</div>
      <div className="company_employees-subitem">{employee.title}</div>
      <div className="company_employees-subitem">{employee.country}</div>
    </li>
  )
}

const Company = () => {
  const { companyId } = useParams()
  const { companies, fetchCompanyDetails, updateCompanyName, saveCompany } = useCompanies()
  const company = companies[companyId]
  const [selectedDept, setSelectedDept] = useState()
  const isCompanyFetched = !!company?.departments

  const saveCompanyName = useDebouncedCallback(name => {
    saveCompany(companyId, name)
  }, 500)

  useEffect(() => {
    if (companyId && !isCompanyFetched) {
      fetchCompanyDetails(companyId)
    }
  }, [companyId, fetchCompanyDetails, isCompanyFetched])

  useEffect(() => {
    if (!selectedDept && isCompanyFetched) {
      const depts = Object.keys(company.departments)
      if (depts.length) {
        setSelectedDept(company.departments[depts[0]])
      } else {
        setSelectedDept({})
      }
    }
  }, [selectedDept, company.departments, isCompanyFetched])

  const onCompanyNameChanged = e => {
    const name = e.target.value
    updateCompanyName(companyId, name)
    saveCompanyName(name)
  }

  if (!isCompanyFetched) {
    return (<div>Loading...</div>)
  }

  return (
    <div className="company">
      <dl>
        <dt>Name:</dt>
        <dd>
          <input value={company.name} onChange={onCompanyNameChanged} />
        </dd>
        <dt>Segment</dt>
        <dd>{company.segment}</dd>
        <dt>Region</dt>
        <dd>{company.region}</dd>
        <dt>Industry</dt>
        <dd>{company.industry}</dd>
        <dt>Departments</dt>
        <dd>
          <select onChange={e => setSelectedDept(company.departments[e.target.value])} value={selectedDept?.id}>
            {Object.values(company.departments).map(dept => (
              <option key={dept.id} value={dept.id}>{dept.name} ({dept.employees.length})</option>
            ))}
          </select>
          {selectedDept?.employees && (
            <ul className="company_employees">
              {selectedDept.employees.map(e => <Employee key={e.id} employee={e} />)}
            </ul>
          )}
        </dd>
      </dl>
    </div>
  )
}

export default Company
