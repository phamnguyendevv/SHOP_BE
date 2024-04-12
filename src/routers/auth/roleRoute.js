
import express from 'express'
import wrapAsync from '../../utils/handlers.js'
import rolesController from '../../controllers/rolesController.js'
const router = express.Router()



router.get('/s', (req, res) => {
    res.send('ssssssssssssss')
})

router.post('/addRole',wrapAsync(rolesController.addRoleController))
router.get('/getRoles',wrapAsync(rolesController.getRolesController))
router.post('/updateRole',wrapAsync(rolesController.updateRoleController))



export default router;


