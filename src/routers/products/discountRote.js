import express from 'express'
import discountController from '../../controllers/discountController.js'
import discountMiddlewares from '../../middlewares/discountMiddlewares.js'
import wrapAsync from '../../utils/handlers.js'
const router = express.Router()


router.post('/', discountMiddlewares.addDiscountValidator, wrapAsync(discountController.addDiscountController))
router.put('/', discountMiddlewares.updateDiscountValidator, wrapAsync(discountController.updateDiscountController))

router.delete('/', wrapAsync(discountController.deleteDiscountController))
router.get('/', wrapAsync(discountController.getAllDiscounts))

// router.get('/discount-by-code', wrapAsync(discountController.getDiscountByCode))
// router.post("/get-list", wrapAsync(technologyController.getTechnologyList));

export default router;