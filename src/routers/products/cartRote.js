import express from 'express'
import cartController from '../../controllers/cartController.js'
import cartMiddlewares from '../../middlewares/cartMiddlewares.js'
import wrapAsync from '../../utils/handlers.js'
const router = express.Router()


router.post('/', cartMiddlewares.addCartValidator, wrapAsync(cartController.addToCartController))
router.put('/',wrapAsync(cartController.updateCartController))
router.delete('/:id', wrapAsync(cartController.removeFromCartController))
router.get('/', wrapAsync(cartController.getCartController))



export default router;