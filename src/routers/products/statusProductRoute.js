import express from 'express'
import wrapAsync from '../../utils/handlers.js'
import statusProductController from '../../controllers/statusProductController.js'
const router = express.Router()




router.post('/status-product',wrapAsync(statusProductController.addStatusController))
router.get('/status-product',wrapAsync(statusProductController.getStatusController))
router.put('/status-product',wrapAsync(statusProductController.updateStatusController))
router.delete('/status-product',wrapAsync(statusProductController.deleteStatusController))

export default router;


