import axios from 'axios'
import { getCookie } from '~/utils/manageCookies'

const baseURL = 'https://shggaya.fly.dev/api/v1'
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
const getMyPermissions = (payload) => {
  return apiClient.get('/employees/permission', payload)
}
const getEmployeeGroupPermissions = (payload) => {
  return apiClient.post('/employees/permission', payload)
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
const getAllGroups = () => {
  return apiClient.get('/groups')
}
const createGroup = (payload) => {
  return apiClient.post('/groups', payload)
}
const updateGroup = (payload) => {
  return apiClient.patch('/groups', payload)
}
const getMyGroups = () => {
  return apiClient.get('/groups/employee')
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
const getGroup = (payload) => {
  return apiClient.post('/groups/group', payload)
}
const createUser = (payload) => {
  return apiClient.post('/users', payload)
}
const updateUser = (payload) => {
  return apiClient.patch('/users', payload)
}
const deleteUser = (payload) => {
  return apiClient.put('/users', payload)
}
const getAllGroupUsers = (payload) => {
  return apiClient.post('/users/group', payload)
}
const getUser = (payload) => {
  return apiClient.post('/users/user', payload)
}
const getAllUserSavings = (payload) => {
  return apiClient.post('/savings/user', payload)
}
const createUserSaving = (payload) => {
  return apiClient.post('/savings', payload)
}
const deleteUserSaving = (payload) => {
  return apiClient.put('/savings', payload)
}
const getAllUsersGroupSavings = (payload) => {
  return apiClient.post('/savings/group', payload)
}
const getAllUserLoans = (payload) => {
  return apiClient.post('/loans/user', payload)
}
const getUserLoanDetails = (payload) => {
  return apiClient.post('/loans/loan', payload)
}
const createUserLoan = (payload) => {
  return apiClient.post('/loans', payload)
}
const updateUserLoanStatus = (payload) => {
  return apiClient.patch('/loans', payload)
}
const deleteUserLoan = (payload) => {
  return apiClient.put('/loans', payload)
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
const deleteUserLoanInstallment = (payload) => {
  return apiClient.put('/loanInstallments', payload)
}
const getAllUsersGroupLoanInstallments = (payload) => {
  return apiClient.post('/loanInstallments/group', payload)
}
const getDiaryNotes = (payload) => {
  return apiClient.post('/diarys/notes', payload)
}
const createDiaryNote = (payload) => {
  return apiClient.post('/diarys', payload)
}
const deleteDiaryNote = (payload) => {
  return apiClient.put('/diarys', payload)
}
const getBankTransactions = (payload) => {
  return apiClient.post('/banktransactions/transactions', payload)
}
const createBankTransaction = (payload) => {
  return apiClient.post('/banktransactions', payload)
}
const deleteBankTransaction = (payload) => {
  return apiClient.put('/banktransactions', payload)
}
const getFundings = (payload) => {
  return apiClient.post('/fundings/fundings', payload)
}
const createFunding = (payload) => {
  return apiClient.post('/fundings', payload)
}
const deleteFunding = (payload) => {
  return apiClient.put('/fundings', payload)
}
const adminPanel = (payload) => {
  return apiClient.post('/adminPanel/result', payload)
}
const userPdf = (payload) => {
  return apiClient.post('/pdf/user', payload)
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
  deleteUserSaving,
  getAllUsersGroupSavings,
  getAllUserLoans,
  createUserLoan,
  updateUserLoanStatus,
  deleteUserLoan,
  getAllUsersGroupLoans,
  getAllUserLoanInstallments,
  getUserLoanDetails,
  createUserLoanInstallment,
  getAllUsersGroupLoanInstallments,
  deleteUserLoanInstallment,
  getDiaryNotes,
  createDiaryNote,
  deleteDiaryNote,
  getBankTransactions,
  createBankTransaction,
  deleteBankTransaction,
  getFundings,
  createFunding,
  deleteFunding,
  adminPanel,
  userPdf,
}
