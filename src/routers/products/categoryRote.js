import express from 'express'
import categoryController from '../../controllers/caterogyController.js'
import categoryMiddlewares from '../../middlewares/categoryMiddewares.js'
import wrapAsync from '../../utils/handlers.js'
const router = express.Router()




router.post('/', categoryMiddlewares.addCategoryValidator, wrapAsync(categoryController.addCategory))

//update category
router.put('/', categoryMiddlewares.updateCategoryValidator, wrapAsync(categoryController.updateCategory))

//delete category
router.delete('/', categoryMiddlewares.deleteCategoryValidator, wrapAsync(categoryController.deleteCategory))

// get category get-list
router.post("/get-list", wrapAsync(categoryController.getCategoryList));

export default router;