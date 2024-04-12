import express from 'express'
import wrapAsync from '../../utils/handlers.js'
import statusProductController from '../../controllers/statusProductController.js'
const router = express.Router()




router.post('/addstatusPro',wrapAsync(statusProductController.addStatusController))
router.get('/getstatusPro',wrapAsync(statusProductController.getStatusController))
router.put('/updatestatusPro',wrapAsync(statusProductController.updateStatusController))
router.delete('/deletestatusPro',wrapAsync(statusProductController.deleteStatusController))

export default router;


