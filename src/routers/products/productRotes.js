import express from 'express'
import productController from '../../controllers/productController.js'
import productMiddlewares from '../../middlewares/productMiddewares.js'
import wrapAsync from '../../utils/handlers.js'
const router = express.Router()


router.post('/addProduct', productMiddlewares.addProductValidator, wrapAsync(productController.addProductController))
router.post('/updateProduct', productMiddlewares.updateProductValidator, wrapAsync(productController.updateProductController))
router.delete('/deleteProduct', wrapAsync(productController.deleteProductController))
//get product by category
router.get('/getProductByCategory', wrapAsync(productController.getProductByCategory))
//get onet product
router.get('/getOneProduct', wrapAsync(productController.getOneProduct))



// ---------------------------------------- Popular product----------------------------------------
//update product Popular
router.post('/updateProductPopular', wrapAsync(productController.updateProductPopularController))

//get prodtuct Popular by category
router.get('/getProductPopularByCategory', wrapAsync(productController.getProductPopularByCategory))


export default router;