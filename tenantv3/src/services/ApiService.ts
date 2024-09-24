import axios from 'axios'
import keycloak from '../plugin/keycloak'

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

  (error) => Promise.reject(error),
  { synchronous: true }
)
apiService.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.log('err')
    }
    return Promise.reject(error)
  },
  { synchronous: true }
)
