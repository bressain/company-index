import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDebouncedCallback } from 'use-debounce'
import './Company.css'

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
  const [company, setCompany] = useState()
  const [selectedDept, setSelectedDept] = useState()

  const saveCompanyName = useDebouncedCallback(name => {
    fetch('/companies', {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        companyId,
      })
    })
  }, 500)

  useEffect(() => {
    async function fetchCompany() {
      const res = await fetch(`/companies/${companyId}`)
      const { message, data } = await res.json()
      if (message === 'success') {
        setCompany(data)
        const depts = Object.keys(data.departments)
        if (depts.length) {
          setSelectedDept(data.departments[depts[0]])
        }
      }
    }

    fetchCompany()
  }, [companyId])

  const onCompanyNameChanged = e => {
    const name = e.target.value
    setCompany(prev => ({ ...prev, name }))
    saveCompanyName(name)
  }

  if (!company) {
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
          {selectedDept && (
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
