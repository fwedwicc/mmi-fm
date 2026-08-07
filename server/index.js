import dns from 'dns'
dns.setServers(['8.8.8.8', '1.1.1.1'])
import cors from 'cors'
import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import authRoute from './routes/authRoute.js'
import onboardingRoute from './routes/onboardingRoute.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 5000

app.use(cors({
  origin: true,
  credentials: true
}))

// Middleware to parse JSON
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is ready")
})

// Routes
app.use('/api/auth', authRoute)
app.use('/api/onboarding', onboardingRoute)

app.listen(port, () => {
  connectDB()
  console.log(`Server is running on port ${port}`)
})