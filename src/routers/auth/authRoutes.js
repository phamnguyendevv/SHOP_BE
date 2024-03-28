import express from 'express'

import authController from '../../controllers/authController.js'
import userMiddlewares from '../../middlewares/userMiddewares.js'
const router = express.Router()


router.get('/', (req, res) => {
    res.send('Hello World!')
})

router.post('/register', authController.registerController)
router.post('/login', userMiddlewares.loginValidator, authController.loginController)



export default router;