import express from 'express'
import categoryController from '../../controllers/caterogyController.js'
import categoryMiddlewares from '../../middlewares/categoryMiddewares.js'
import wrapAsync from '../../utils/handlers.js'
const router = express.Router()


router.get('/', (req, res) => {
    res.send('Hello World!')
})

router.post('/addCategory/', categoryMiddlewares.addCategoryValidator,categoryController.addCategory)

//get all categories
router.get('/getAllCategories',categoryController.getAllCategories)

//update category
router.post('/updateCategory',categoryMiddlewares.updateCategoryValidator,  categoryController.updateCategory)

//delete category
router.delete('/deleteCategory', categoryMiddlewares.deleteCategoryValidator, wrapAsync(categoryController.deleteCategory))

// get category hot trend




export default router;