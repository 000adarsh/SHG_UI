import axios from 'axios'
import { getCookie } from '~/utils/manageCookies'

const baseURL = 'https://shggaya.herokuapp.com/api/v1'
let apiClient = axios.create({
  baseURL,
  withCredentials: false,
  timeout: 30000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  validateStatus: (status) => {
    return status < 600 // Reject only if the status code is greater than or equal to 600
  },
})

const setAuthHeader = () => {
  apiClient = axios.create({
    baseURL,
    withCredentials: false,
    timeout: 30000,
    headers: {
      authorization: `Bearer ${getCookie('token')}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    validateStatus: (status) => {
      return status < 600 // Reject only if the status code is greater than or equal to 600
    },
  })
}

const login = (payload) => {
  return apiClient.post('/auth/login', payload)
}
const forgotPassword = (payload) => {
  return apiClient.post('/auth/forgotpassword', payload)
}
const resetPassword = (payload) => {
  return apiClient.patch(`/auth/resetpassword/${payload.link}`, payload)
}
const signup = (payload) => {
  return apiClient.post('/auth/signup/', payload)
}
const getAllEmployees = () => {
  return apiClient.get('/employees')
}
const getEmployee = (payload) => {
  return apiClient.post('/employees', payload)
}
const updateEmployee = (payload) => {
  return apiClient.patch('/employees', payload)
}
const getMyGroups = () => {
  return apiClient.get('/groups/employee')
}
const getEmployeeGroupPermissions = (payload) => {
  return apiClient.post('/employees/permission', payload)
}
const getMyPermissions = (payload) => {
  return apiClient.get('/employees/permission', payload)
}
const addEmployeePermissions = (payload) => {
  return apiClient.patch('/employees/permission', payload)
}
const removeEmployeePermissions = (payload) => {
  return apiClient.put('/employees/permission', payload)
}
const getEmployeeGroups = (payload) => {
  return apiClient.post('/employees/group', payload)
}
const createGroup = (payload) => {
  return apiClient.post('/groups', payload)
}
const getGroup = (payload) => {
  return apiClient.post('/groups/group', payload)
}
const getAllGroups = () => {
  return apiClient.get('/groups')
}
const addEmployeeToGroup = (payload) => {
  return apiClient.post('/groups/employee', payload)
}
const removeEmployeeFromGroup = (payload) => {
  return apiClient.put('/groups/employee', payload)
}
const getMyGroupPermissions = (payload) => {
  return apiClient.post('/groups/permission', payload)
}
const addEmployeeGroupPermissions = (payload) => {
  return apiClient.patch('/groups/permission', payload)
}
const removeEmployeeGroupPermissions = (payload) => {
  return apiClient.put('/groups/permission', payload)
}
const updateGroup = (payload) => {
  return apiClient.patch('/groups', payload)
}
const getAllGroupUsers = (payload) => {
  return apiClient.post('/users/group', payload)
}
const createUser = (payload) => {
  return apiClient.post('/users', payload)
}
const getUser = (payload) => {
  return apiClient.post('/users/user', payload)
}
const updateUser = (payload) => {
  return apiClient.patch('/users', payload)
}
const deleteUser = (payload) => {
  return apiClient.put('/users', payload)
}
const getAllUserSavings = (payload) => {
  return apiClient.post('/savings/user', payload)
}
const createUserSaving = (payload) => {
  return apiClient.post('/savings', payload)
}
const getAllUsersGroupSavings = (payload) => {
  return apiClient.post('/savings/group', payload)
}
const getAllUserLoans = (payload) => {
  return apiClient.post('/loans/user', payload)
}
const createUserLoan = (payload) => {
  return apiClient.post('/loans', payload)
}
const getUserLoanDetails = (payload) => {
  return apiClient.post('/loans/loan', payload)
}
const getAllUsersGroupLoans = (payload) => {
  return apiClient.post('/loans/group', payload)
}
const getAllUserLoanInstallments = (payload) => {
  return apiClient.post('/loanInstallments/loan', payload)
}
const createUserLoanInstallment = (payload) => {
  return apiClient.post('/loanInstallments', payload)
}
const getAllUsersGroupLoanInstallments = (payload) => {
  return apiClient.post('/loanInstallments/group', payload)
}
const deleteUserLoanInstallment = (payload) => {
  return apiClient.put('/loanInstallments', payload)
}

export default {
  setAuthHeader,
  login,
  forgotPassword,
  resetPassword,
  signup,
  getAllEmployees,
  getEmployee,
  updateEmployee,
  getMyGroups,
  getEmployeeGroupPermissions,
  getMyPermissions,
  addEmployeePermissions,
  removeEmployeePermissions,
  getEmployeeGroups,
  createGroup,
  getGroup,
  getAllGroups,
  addEmployeeToGroup,
  removeEmployeeFromGroup,
  getMyGroupPermissions,
  addEmployeeGroupPermissions,
  removeEmployeeGroupPermissions,
  updateGroup,
  getAllGroupUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  getAllUserSavings,
  createUserSaving,
  getAllUsersGroupSavings,
  getAllUserLoans,
  createUserLoan,
  getAllUsersGroupLoans,
  getAllUserLoanInstallments,
  getUserLoanDetails,
  createUserLoanInstallment,
  getAllUsersGroupLoanInstallments,
  deleteUserLoanInstallment,
}
