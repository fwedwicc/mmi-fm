import axios from './axiosConfig'
import { ENDPOINTS } from '../config/endpoints'

export const authService = {

  signUp: async (data) => {
    const response = await axios.post(
      ENDPOINTS.AUTH.SIGNUP,
      data
    )

    return response.data
  },

  login: async (data) => {
    const response = await axios.post(
      ENDPOINTS.AUTH.LOGIN,
      data
    )

    return response.data
  },

  getMe: async () => {
    const response = await axios.get(
      ENDPOINTS.AUTH.ME
    )

    return response.data
  },

  logout: async () => {
    const response = await axios.post(
      ENDPOINTS.AUTH.LOGOUT
    )

    return response.data
  }
}