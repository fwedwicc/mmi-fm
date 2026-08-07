import express from 'express'

import {
  signup,
  login,
  getMe,
  logout
} from '../controllers/authController.js'

import {
  authenticate
} from '../middlewares/authMiddleware.js'

const router = express.Router()

// Public routes
router.post('/signup', signup)
router.post('/login', login)

// Protected routes
router.get('/me', authenticate, getMe)
router.post('/logout', authenticate, logout)

export default router