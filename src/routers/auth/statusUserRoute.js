import express from 'express'
import wrapAsync from '../../utils/handlers.js'
import statusUserController from '../../controllers/statusUserController.js'
const router = express.Router()




router.post('/status',wrapAsync(statusUserController.addStatusController))
router.get('/status',wrapAsync(statusUserController.getStatusController))
router.put('/status',wrapAsync(statusUserController.updateStatusController))
router.delete('/status',wrapAsync(statusUserController.deleteStatusController))

export default router;


