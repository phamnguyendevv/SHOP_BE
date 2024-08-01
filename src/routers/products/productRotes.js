import express from 'express'
import productController from '../../controllers/productController.js'
import productMiddlewares from '../../middlewares/productMiddewares.js'
import statusProductController from '../../controllers/statusProductController.js'
import wrapAsync from '../../utils/handlers.js'
const router = express.Router()


router.post('/',productMiddlewares.addProductValidator,wrapAsync(productController.addProductController))
router.patch('/',productMiddlewares.updateProductValidator, wrapAsync(productController.updateProductController))
router.delete('/',productMiddlewares.deleteProductValidator, wrapAsync(productController.deleteProductController))

router.get('/', wrapAsync(productController.getProductBySlug))
router.post('/get-list', wrapAsync(productController.getList))


router.post('/status',wrapAsync(statusProductController.addStatusController))
router.get('/status',wrapAsync(statusProductController.getStatusController))
router.put('/status',wrapAsync(statusProductController.updateStatusController))
router.delete('/status/:id',wrapAsync(statusProductController.deleteStatusController))


router.post('/image',productMiddlewares.addImageValidator , wrapAsync(productController.addImageController))
router.put(
    "/image",
    productMiddlewares.updateImageValidator,
    wrapAsync(productController.updateImageController)
);

router.delete(
  "/image",
  productMiddlewares.deleteImageValidator,
  wrapAsync(productController.deleteImageController)
);
router.get(
  "/image",
  productMiddlewares.getImageValidator,
  wrapAsync(productController.getImageController)
);
router.get('/image', wrapAsync(productController.getImageController))


export default router;