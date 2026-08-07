import axios from './axiosConfig'
import { ENDPOINTS } from '../config/endpoints'

export const dashboardService = {
  // Account Information
  updateAccountInformation: async (data) => {
    const response = await axios.post(
      ENDPOINTS.ONBOARDING.ACCOUNT_INFORMATION,
      data
    )

    return response.data
  },

  // Keywords
  saveKeywords: async (data) => {
    const response = await axios.post(
      ENDPOINTS.ONBOARDING.KEYWORDS,
      data
    )

    return response.data
  },

  // Sources
  saveSources: async (data) => {
    const response = await axios.post(
      ENDPOINTS.ONBOARDING.SOURCES,
      data
    )

    return response.data
  },

  // Publishers
  savePublishers: async (data) => {
    const response = await axios.post(
      ENDPOINTS.ONBOARDING.PUBLISHERS,
      data
    )

    return response.data
  },

  // Review
  getReview: async () => {
    const response = await axios.get(
      ENDPOINTS.ONBOARDING.REVIEW
    )

    return response.data
  },

  // Complete onboarding
  completeOnboarding: async () => {
    const response = await axios.post(
      ENDPOINTS.ONBOARDING.COMPLETE
    )

    return response.data
  }
}