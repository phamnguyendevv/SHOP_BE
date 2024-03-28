import express from 'express'
import authRouter from './auth/authRoutes.js'

const router = express.Router()



router.use('/api/v0', authRouter)


export default router;
