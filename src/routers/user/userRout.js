import express from 'express'
import wrapAsync from '../../utils/handlers.js'
import userController from '../../controllers/userController.js'

import userMiddlewares from '../../middlewares/userMiddewares.js'
const router = express.Router()



//------------------------user---------------------
router.post('/get-list', wrapAsync(userController.getList))

router.get('/', wrapAsync(userController.getUserById))
//update
router.put('/', userMiddlewares.updateValidator,wrapAsync(userController.updateUser))
//delete
export default router;