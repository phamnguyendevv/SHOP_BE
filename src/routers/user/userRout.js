import express from 'express'
import wrapAsync from '../../utils/handlers.js'
import userController from '../../controllers/userController.js'
import rolesController from '../../controllers/rolesController.js'
import statusUserController from '../../controllers/statusUserController.js'
const router = express.Router()

//------------------------role---------------------
router.post('/role',wrapAsync(rolesController.addRoleController))
router.get('/role',wrapAsync(rolesController.getRolesController))
router.put('/role',wrapAsync(rolesController.updateRoleController))

//------------------------status---------------------
router.post('/status',wrapAsync(statusUserController.addStatusController))
router.get('/status',wrapAsync(statusUserController.getStatusController))
router.put('/status',wrapAsync(statusUserController.updateStatusController))
router.delete('/status:id',wrapAsync(statusUserController.deleteStatusController))

//------------------------user---------------------
router.post('/get-list', wrapAsync(userController.getList))



export default router;