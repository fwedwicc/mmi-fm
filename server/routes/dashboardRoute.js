import express from 'express'
import { authenticate } from '../middlewares/authMiddleware.js'
import { getSources, getPublishers } from '../controllers/dashboardController.js'

const router = express.Router()

router.get('/sources', authenticate, getSources)
router.get('/publishers', authenticate, getPublishers)

export default router