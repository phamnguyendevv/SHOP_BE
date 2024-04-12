import express from 'express'
import discountController from '../../controllers/discountController.js'
import discountMiddlewares from '../../middlewares/discountMiddlewares.js'
import wrapAsync from '../../utils/handlers.js'
const router = express.Router()


router.post('/adDDiscount', discountMiddlewares.addDiscountValidator, wrapAsync(discountController.addDiscountController))
router.post('/updateDiscount', discountMiddlewares.updateDiscountValidator,wrapAsync(discountController.updateDiscountController))
router.delete('/deleteDiscount', wrapAsync(discountController.deleteDiscountController))
router.get('/getDiscountByCode', wrapAsync(discountController.getDiscountByCode))
router.get('/getDiscountbyId', wrapAsync(discountController.getDiscountById))

export default router;