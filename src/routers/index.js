import express from 'express'
import authRouter from './auth/authRoutes.js'
import userRouter from './user/userRout.js'
import statusUserRouter from './auth/statusUserRoute.js'
import roleRouter from './auth/roleRoute.js'
import statusProductRouter from './products/statusProductRoute.js'
import cateRouter from './products/categoryRote.js'
import productRouter from './products/productRotes.js'
import discountRote from './products/discountRote.js'
import cartRouter from './products/cartRote.js'
const router = express.Router()

router.get("/", (req, res) => {
    res.send("Shope web here!");
});

router.use('/api/v0/auth', authRouter)
router.use('/api/v0/user',userRouter)


router.use('/api/v0', statusUserRouter)
router.use('/api/v0', roleRouter)
router.use('/api/v0/category', cateRouter)
router.use('/api/v0/product', productRouter)
router.use('/api/v0/discount', discountRote)
router.use('/api/v0', statusProductRouter)
router.use('/api/v0', cartRouter)


export default router;
