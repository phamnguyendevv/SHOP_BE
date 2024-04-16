import express from 'express'
import productController from '../../controllers/productController.js'
import productMiddlewares from '../../middlewares/productMiddewares.js'
import wrapAsync from '../../utils/handlers.js'
const router = express.Router()


router.post('/product', productMiddlewares.addProductValidator, wrapAsync(productController.addProductController))
router.put('/product', productMiddlewares.updateProductValidator, wrapAsync(productController.updateProductController))
router.delete('/product', wrapAsync(productController.deleteProductController))
//get product by category
router.get('/get-product-by-category', wrapAsync(productController.getProductByCategory))
//get onet product
router.get('/get-by-id', wrapAsync(productController.getOneProduct))



// ---------------------------------------- Popular product----------------------------------------
//update product Popular
router.post('/product-popular', wrapAsync(productController.updateProductPopularController))

//get prodtuct Popular by category
router.get('/get-product-popular-by-category', wrapAsync(productController.getProductPopularByCategory))


export default router;