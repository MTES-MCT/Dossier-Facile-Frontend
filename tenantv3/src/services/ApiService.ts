import axios from 'axios'
import { keycloak } from '../plugin/keycloak'

export const apiService = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`
})

apiService.interceptors.request.use(
  (config) => {
    if (keycloak.authenticated && config?.headers) {
      const localToken = keycloak.token
      config.headers.Authorization = `Bearer ${localToken}`
    }
    return config
  },

  (error: Error) => Promise.reject(error),
  { synchronous: true }
)
apiService.interceptors.response.use(
  (response) => response,
  (error: Error) => Promise.reject(error)
)
