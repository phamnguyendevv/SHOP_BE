import express from 'express'
import cartController from '../../controllers/cartController.js'
import cartMiddlewares from '../../middlewares/cartMiddlewares.js'
import wrapAsync from '../../utils/handlers.js'
const router = express.Router()


router.post('/addCart', cartMiddlewares.addCartValidator, wrapAsync(cartController.addToCartController))
router.post('/updateCart',wrapAsync(cartController.updateCartController))
router.delete('/deleteCart', wrapAsync(cartController.removeFromCartController))
router.get('/getCart', wrapAsync(cartController.getCartController))



export default router;