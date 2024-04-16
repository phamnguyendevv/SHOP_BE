
import express from 'express'
import wrapAsync from '../../utils/handlers.js'
import rolesController from '../../controllers/rolesController.js'
const router = express.Router()




router.post('/role',wrapAsync(rolesController.addRoleController))
router.get('/role',wrapAsync(rolesController.getRolesController))
router.put('/role',wrapAsync(rolesController.updateRoleController))









export default router;


