import express from 'express'
import cartController from '../../controllers/cartController.js'
import cartMiddlewares from '../../middlewares/cartMiddlewares.js'
import wrapAsync from '../../utils/handlers.js'
const router = express.Router()


router.post('/cart', cartMiddlewares.addCartValidator, wrapAsync(cartController.addToCartController))
router.put('/cart',wrapAsync(cartController.updateCartController))
router.delete('/cart', wrapAsync(cartController.removeFromCartController))
router.get('/cart', wrapAsync(cartController.getCartController))



export default router;