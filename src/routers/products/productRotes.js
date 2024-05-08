import express from 'express'
import productController from '../../controllers/productController.js'
import productMiddlewares from '../../middlewares/productMiddewares.js'
import statusProductController from '../../controllers/statusProductController.js'
import wrapAsync from '../../utils/handlers.js'
const router = express.Router()


router.post('/',wrapAsync(productController.addProductController))
router.patch('/', wrapAsync(productController.updateProductController))
router.delete('/:id', wrapAsync(productController.deleteProductController))
//get product by category

router.get('/:slug_product', wrapAsync(productController.getProductBySlug))

router.post('/get-list', wrapAsync(productController.getList))



// ---------------------------------------- Popular product----------------------------------------
//update product Popular
router.post('/product-popular', wrapAsync(productController.updateProductPopularController))

//get prodtuct Popular by category
router.get('/get-product-popular-by-category', wrapAsync(productController.getProductPopularByCategory))










router.post('/status',wrapAsync(statusProductController.addStatusController))
router.get('/status',wrapAsync(statusProductController.getStatusController))
router.put('/status',wrapAsync(statusProductController.updateStatusController))
router.delete('/:id',wrapAsync(statusProductController.deleteStatusController))




export default router;