import create from 'zustand'

export const useCompanies = create(set => ({
  companies: {},
  isCompaniesFetched: false,
  fetchCompanies: async () => {
    const response = await fetch('/companies');
    const { message, data } = await response.json();
    if (message === 'success') {
      set(() => ({
        companies: data.reduce((acc, company) => {
          acc[company.id] = company
          return acc
        }, {})
      }))
    }
  },
  fetchCompanyDetails: async (companyId) => {
    const res = await fetch(`/companies/${companyId}`)
    const { message, data } = await res.json()
    if (message === 'success') {
      set(state => ({
        companies: { ...state.companies, [companyId]: data },
        isCompanyFetched: { ...state.isCompanyFetched, [companyId]: true }
      }))
    }
  },
  updateCompanyName: (companyId, name) => {
    set(state => ({ companies: { ...state.companies, [companyId]: { ...state.companies[companyId], name } } }))
  },
  saveCompany: async (companyId, name) => {
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
  }
}))
