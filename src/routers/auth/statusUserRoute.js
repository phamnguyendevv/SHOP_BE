import express from 'express'
import wrapAsync from '../../utils/handlers.js'
import statusUserController from '../../controllers/statusUserController.js'
const router = express.Router()




router.post('/addstatus',wrapAsync(statusUserController.addStatusController))
router.get('/getstatus',wrapAsync(statusUserController.getStatusController))
router.put('/updatestatus',wrapAsync(statusUserController.updateStatusController))
router.delete('/deletestatus',wrapAsync(statusUserController.deleteStatusController))

export default router;


