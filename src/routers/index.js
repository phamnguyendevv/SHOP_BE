import express from 'express'
import authRouter from './auth/authRoutes.js'
import userRouter from './user/userRout.js'
import cateRouter from './products/categoryRote.js'
import productRouter from './products/productRotes.js'
import discountRote from './products/discountRote.js'
import cartRouter from './products/cartRote.js'
const router = express.Router()

router.get("/api/v0", (req, res) => {
    res.send("Shope web here!");
});

router.use('/api/v0/auth', authRouter)
router.use('/api/v0/user',userRouter)
router.use('/api/v0/category', cateRouter)
router.use('/api/v0/product', productRouter)
router.use('/api/v0/discount', discountRote)
router.use('/api/v0/cart', cartRouter)


export default router;
