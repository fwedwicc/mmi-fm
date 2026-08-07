import express from 'express'

import { authenticate } from '../middlewares/authMiddleware.js'
import { updateAccountInformation, saveKeywords, saveSources, savePublishers, getReview, completeOnboarding } from '../controllers/onboardingController.js'

const router = express.Router()

router.post('/account-information', authenticate, updateAccountInformation)
router.post('/keywords', authenticate, saveKeywords)
router.post('/sources', authenticate, saveSources)
router.post('/publishers', authenticate, savePublishers)
router.get('/review', authenticate, getReview)
router.post('/complete', authenticate, completeOnboarding)

export default router