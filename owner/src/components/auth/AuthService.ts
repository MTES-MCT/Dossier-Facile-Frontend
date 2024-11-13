import { User } from 'df-shared-next/src/models/User'
import axios from 'axios'
import { CookiesService } from 'df-shared-next/src/services/CookiesService'
import type { OwnerUser } from 'df-shared-next/src/models/OwnerUser'

const API_URL = `${import.meta.env.VITE_OWNER_API_URL}/api/`

const AuthService = {
  logout() {
    return axios.post<void>(`${API_URL}owner/logout`)
  },

  register(user: User) {
    return axios.post<OwnerUser>(`${API_URL}register/account`, {
      email: user.email,
      password: user.password
    })
  },

  deleteAccount() {
    return axios.delete<void>(`${API_URL}owner/deleteAccount`)
  },

  resetPassword(user: User) {
    return axios.post<void>(`${API_URL}register/forgotPassword`, {
      email: user.email
    })
  },

  changePassword(user: User) {
    return axios.post<OwnerUser>(`${API_URL}register/createPassword/${user.token}`, {
      password: user.password
    })
  },

  loadUser() {
    return axios
      .get<OwnerUser>(`${API_URL}owner/profile`, {
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
    return axios.get<void>(`${API_URL}register/confirmAccount/${token}`)
  }
}

export default AuthService
