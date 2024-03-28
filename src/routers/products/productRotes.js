import express from 'express'

import productController from '../../controllers/productController.js'

const router = express.Router()


router.get('/', (req, res) => {
    res.send('Hello World!')
})

router.get('/category', productController.getAllProducts)



export default router;