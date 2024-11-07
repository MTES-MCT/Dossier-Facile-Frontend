import { apiService } from './../../../tenantv3/src/services/ApiService'
import { User } from '../models/User'
import axios from 'axios'
import { CookiesService } from './CookiesService'

const API_URL = `${import.meta.env.VITE_API_URL}/api/`

export const AuthService = {
  logout() {
    return axios.post<void>(API_URL + 'user/logout')
  },

  deleteAccount() {
    return axios.delete<void>(API_URL + 'user/deleteAccount')
  },

  createPasswordCouple(user: User) {
    return axios.post<User>(`${API_URL}user/createPassword/${user.token}`, {
      password: user.password
    })
  },
  createPasswordGroup(user: User) {
    return axios.post<User>(`${API_URL}user/createPassword/${user.token}`, {
      password: user.password
    })
  },

  loadUser() {
    return apiService
      .get('tenant/profile', {
        params: {
          nocache: new Date().getTime(),
          ...CookiesService.getJsonCookie('acquisition')
        }
      })
      .then((res) => {
        CookiesService.deleteCookie('acquisition')
        return res
      })
  },

  confirmAccount(token: string) {
    return axios.get<void>(`${API_URL}tenant/doNotArchive/${token}`)
  },
  generatePasswordPlaceholder() {
    const chars = [
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
      '0123456789',
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
      '#!?-_.'
    ]
    return [4, 4, 2, 2]
      .map(function (len, i) {
        return Array(len)
          .fill(chars[i])
          .map(function (x) {
            return x[Math.floor(Math.random() * x.length)]
          })
          .join('')
      })
      .concat()
      .join('')
      .split('')
      .sort(function () {
        return 0.5 - Math.random()
      })
      .join('')
  }
}
