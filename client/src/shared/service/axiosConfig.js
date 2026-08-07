import axios from 'axios'
import { useUserStore } from '../store'

// Create axios interceptor to add token to requests
axios.interceptors.request.use(
  (config) => {
    const token = useUserStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle 401 errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthEndpoint =
      error.config?.url?.includes('/auth/login') ||
      error.config?.url?.includes('/auth/signup')

    if (error.response?.status === 401 && !isAuthEndpoint) {
      // Token expired or invalid on an authenticated request, logout user
      const { logout } = useUserStore.getState()
      logout()
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

export default axios