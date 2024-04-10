import express from 'express'
import authRouter from './auth/authRoutes.js'
import statusRouter from './auth/statusRoute.js'
import cateRouter from './products/categoryRote.js'
import productRouter from './products/productRotes.js'
const router = express.Router()



router.use('/api/v0', authRouter)
router.use('/api/v0', statusRouter)
router.use('/api/v0', cateRouter)
router.use('/api/v0', productRouter)


export default router;
