import express from 'express'
import productController from '../../controllers/productController.js'
import productMiddlewares from '../../middlewares/productMiddewares.js'
import statusProductController from '../../controllers/statusProductController.js'
import wrapAsync from '../../utils/handlers.js'
const router = express.Router()


router.post('/',productMiddlewares.addProductValidator,wrapAsync(productController.addProductController))
router.patch('/', wrapAsync(productController.updateProductController))
router.delete('/:id', wrapAsync(productController.deleteProductController))

router.get('/:slug_product', wrapAsync(productController.getProductBySlug))
router.post('/get-list', wrapAsync(productController.getList))



router.post('/status',wrapAsync(statusProductController.addStatusController))
router.get('/status',wrapAsync(statusProductController.getStatusController))
router.put('/status',wrapAsync(statusProductController.updateStatusController))
router.delete('/status/:id',wrapAsync(statusProductController.deleteStatusController))


export default router;