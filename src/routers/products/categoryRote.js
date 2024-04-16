import express from 'express'
import categoryController from '../../controllers/caterogyController.js'
import categoryMiddlewares from '../../middlewares/categoryMiddewares.js'
import wrapAsync from '../../utils/handlers.js'
const router = express.Router()


router.get('/', (req, res) => {
    res.send('Hello World!')
})

router.post('/category', categoryMiddlewares.addCategoryValidator, wrapAsync(categoryController.addCategory))

//get all categories
router.get('/category',wrapAsync(categoryController.getAllCategories))

//update category
router.put('/category',categoryMiddlewares.updateCategoryValidator, wrapAsync(categoryController.updateCategory))

//delete category
router.delete('/category', categoryMiddlewares.deleteCategoryValidator, wrapAsync(categoryController.deleteCategory))

// get category hot trend



export default router;