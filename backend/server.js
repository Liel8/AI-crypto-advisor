import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import 'dotenv/config'
import { config } from './config/index.js'

import { logger } from './services/logger.service.js'
import { log } from './middlewares/logger.middleware.js'

if (!config.jwtSecret) {
  logger.error('FATAL ERROR: JWT_SECRET environment variable is missing! Server cannot start.')
  console.error('FATAL ERROR: JWT_SECRET environment variable is missing! Server cannot start.')
  process.exit(1)
}

import { authRoutes } from './api/auth/auth.routes.js'
import { userRoutes } from './api/user/user.routes.js'
import { dashboardRoutes } from './api/dashboard/dashboard.routes.js'
import { feedbackRoutes } from './api/feedback/feedback.routes.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()

// Middlewares
app.use(cookieParser())
app.use(express.json())
app.use(log)

// CORS Configuration (Configured for Vite frontend)
const allowedOrigins = [
  'http://127.0.0.1:5173',
  'http://localhost:5173',
  'http://127.0.0.1:5174',
  'http://localhost:5174',
  process.env.FRONTEND_URL
].filter(Boolean)

const corsOptions = {
  origin: allowedOrigins,
  credentials: true
}

app.use(cors(corsOptions))

// Serve public static assets (including meme images)
app.use(express.static(path.resolve(__dirname, 'public')))
app.use('/assets', express.static(path.resolve(__dirname, 'public/assets')))

// Mount API Routes
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/feedback', feedbackRoutes)

// Health Check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'Moveo AI Crypto Advisor Backend',
    timestamp: new Date().toISOString()
  })
})

const port = process.env.PORT || 3030
app.listen(port, () => {
  logger.info(`Crypto Advisor Server is running on port: http://localhost:${port}`)
})
