import axios from 'axios'
import { getCookie } from '~/utils/manageCookies'

const baseURL = 'http://192.168.43.101:5000/api/v1'

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
  return apiClient.get('/employees/')
}
const getEmployee = (payload) => {
  return apiClient.post('/employees/employee', payload)
}

export default {
  setAuthHeader,
  login,
  forgotPassword,
  resetPassword,
  signup,
  getAllEmployees,
  getEmployee,
}
