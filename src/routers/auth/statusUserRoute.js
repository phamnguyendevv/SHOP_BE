import express from 'express'
import wrapAsync from '../../utils/handlers.js'
import statusUserController from '../../controllers/statusUserController.js'
const router = express.Router()




router.post('/',wrapAsync(statusUserController.addStatusController))
router.get('/',wrapAsync(statusUserController.getStatusController))
router.put('/',wrapAsync(statusUserController.updateStatusController))
router.delete('/:id',wrapAsync(statusUserController.deleteStatusController))

export default router;


