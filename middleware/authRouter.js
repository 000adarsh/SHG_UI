import { getCookie } from '~/utils/manageCookies'

export default function ({ redirect, route }) {
  if (!getCookie('token') && route.fullPath !== '/auth') {
    redirect('/auth')
  }
}
