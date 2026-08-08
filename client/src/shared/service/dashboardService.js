import axios from './axiosConfig'
import { ENDPOINTS } from '../config/endpoints'

export const dashboardService = {
  // Onboarding — Account Information
  updateAccountInformation: async (data) => {
    const response = await axios.post(
      ENDPOINTS.ONBOARDING.ACCOUNT_INFORMATION,
      data
    )
    return response.data
  },

  // Onboarding — Keywords
  saveKeywords: async (data) => {
    const response = await axios.post(
      ENDPOINTS.ONBOARDING.KEYWORDS,
      data
    )
    return response.data
  },

  // Onboarding — Sources
  saveSources: async (data) => {
    const response = await axios.post(
      ENDPOINTS.ONBOARDING.SOURCES,
      data
    )
    return response.data
  },

  // Onboarding — Publishers
  savePublishers: async (data) => {
    const response = await axios.post(
      ENDPOINTS.ONBOARDING.PUBLISHERS,
      data
    )
    return response.data
  },

  // Onboarding — Review
  getReview: async () => {
    const response = await axios.get(
      ENDPOINTS.ONBOARDING.REVIEW
    )
    return response.data
  },

  // Onboarding — Complete
  completeOnboarding: async () => {
    const response = await axios.post(
      ENDPOINTS.ONBOARDING.COMPLETE
    )
    return response.data
  },

  // Dashboard — Sources (GET only, POST reuses onboarding endpoint)
  getDashboardSources: async () => {
    const response = await axios.get(
      ENDPOINTS.DASHBOARD.SOURCES
    )
    return response.data
  },

  // Dashboard — Publishers (GET only, POST reuses onboarding endpoint)
  getDashboardPublishers: async () => {
    const response = await axios.get(
      ENDPOINTS.DASHBOARD.PUBLISHERS
    )
    return response.data
  },
}