import express from 'express'

import productController from '../../controllers/productController.js'
import productMiddlewares from '../../middlewares/productMiddewares.js'

const router = express.Router()


router.get('/', (req, res) => {
    res.send('Hello World!')
})

router.post('/addProduct'  , productMiddlewares.addProductValidator  , productController.addProductController)



export default router;