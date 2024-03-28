import express from 'express'
import categoryController from '../../controllers/caterogyController.js'

const router = express.Router()


router.get('/', (req, res) => {
    res.send('Hello World!')
})

router.get('/category', categoryController.getAllCategories)



export default router;