import axios from 'axios'
import { getCookie } from '~/utils/manageCookies'

const baseURL = 'http://192.168.43.144:5000/api/v1'
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
const getAllEmployeeGroups = () => {
  return apiClient.get('/groups/employee')
}
const getEmployeeGroupPermissions = (payload) => {
  return apiClient.post('/employees/permission', payload)
}
const employeeGroups = (payload) => {
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
const updateGroup = (payload) => {
  return apiClient.patch('/groups', payload)
}
const getAllGroupUsers = (payload) => {
  return apiClient.post('/users/group/users', payload)
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
const getAllGroupSavings = (payload) => {
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

export default {
  setAuthHeader,
  login,
  forgotPassword,
  resetPassword,
  signup,
  getAllEmployees,
  getEmployee,
  updateEmployee,
  getAllEmployeeGroups,
  getEmployeeGroupPermissions,
  employeeGroups,
  createGroup,
  getGroup,
  getAllGroups,
  addEmployeeToGroup,
  updateGroup,
  getAllGroupUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  getAllUserSavings,
  createUserSaving,
  getAllGroupSavings,
  getAllUserLoans,
  createUserLoan,
  getAllUsersGroupLoans,
  getAllUserLoanInstallments,
  getUserLoanDetails,
  createUserLoanInstallment,
  getAllUsersGroupLoanInstallments,
}
