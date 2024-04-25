import express from 'express'
import categoryController from '../../controllers/caterogyController.js'
import categoryMiddlewares from '../../middlewares/categoryMiddewares.js'
import wrapAsync from '../../utils/handlers.js'
const router = express.Router()




router.post('/', categoryMiddlewares.addCategoryValidator, wrapAsync(categoryController.addCategory))

//get all categories
router.get('/', wrapAsync(categoryController.getAllCategories))

//update category
router.put('/', categoryMiddlewares.updateCategoryValidator, wrapAsync(categoryController.updateCategory))

//delete category
router.delete('/', categoryMiddlewares.deleteCategoryValidator, wrapAsync(categoryController.deleteCategory))

// get category hot trend



export default router;