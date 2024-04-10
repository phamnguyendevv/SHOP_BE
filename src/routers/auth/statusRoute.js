import express from 'express'
import wrapAsync from '../../utils/handlers.js'
import statusController from '../../controllers/statusController.js'
const router = express.Router()



router.get('/s', (req, res) => {
    res.send('ssssssssssssss')
})

router.post('/addstatus',wrapAsync(statusController.addStatusController))
router.get('/getstatus',wrapAsync(statusController.getStatusController))
router.put('/updatestatus',wrapAsync(statusController.updateStatusController))
router.delete('/deletestatus',wrapAsync(statusController.deleteStatusController))

export default router;


