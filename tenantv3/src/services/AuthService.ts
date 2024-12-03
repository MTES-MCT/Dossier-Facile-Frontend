import type { User } from 'df-shared-next/src/models/User'
import { apiService } from './ApiService'
import axios from 'axios'
import { CookiesService } from 'df-shared-next/src/services/CookiesService'

const API_URL = `${import.meta.env.VITE_API_URL}/api/`

export const AuthService = {
  logout() {
    return axios.post<void>(API_URL + 'user/logout')
  },

  deleteAccount() {
    return axios.delete<void>(API_URL + 'user/deleteAccount')
  },

  createPasswordCouple({ token, password }: { token: string; password: string }) {
    return axios.post<User>(`${API_URL}user/createPassword/${token}`, {
      password
    })
  },
  createPasswordGroup({ token, password }: { token: string; password: string }) {
    return axios.post<User>(`${API_URL}user/createPassword/${token}`, {
      password
    })
  },

  loadUser() {
    return apiService
      .get<User>('tenant/profile', {
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
  }
}
