import { CONFIG } from './config'

export const ENDPOINTS = {
  AUTH: {
    SIGNUP: `${CONFIG.API_BASE_URL}/api/auth/signup`,
    LOGIN: `${CONFIG.API_BASE_URL}/api/auth/login`,
    ME: `${CONFIG.API_BASE_URL}/api/auth/me`,
    LOGOUT: `${CONFIG.API_BASE_URL}/api/auth/logout`,
  },

  ONBOARDING: {
    ACCOUNT_INFORMATION: `${CONFIG.API_BASE_URL}/api/onboarding/account-information`,
    KEYWORDS: `${CONFIG.API_BASE_URL}/api/onboarding/keywords`,
    SOURCES: `${CONFIG.API_BASE_URL}/api/onboarding/sources`,
    PUBLISHERS: `${CONFIG.API_BASE_URL}/api/onboarding/publishers`,
    REVIEW: `${CONFIG.API_BASE_URL}/api/onboarding/review`,
    COMPLETE: `${CONFIG.API_BASE_URL}/api/onboarding/complete`,
  },

  DASHBOARD: {
    // to follow hehe
  }
}