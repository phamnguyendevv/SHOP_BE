import express from 'express'
import wrapAsync from '../../utils/handlers.js'
import userController from '../../controllers/userController.js'
const router = express.Router()


router.post('/get-list', wrapAsync(userController.getList))



export default router;