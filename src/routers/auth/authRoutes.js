import express from 'express'
import wrapAsync from '../../utils/handlers.js'
import authController from '../../controllers/authController.js'
import userMiddlewares from '../../middlewares/userMiddewares.js'
import rolesController from '../../controllers/rolesController.js'
const router = express.Router()


router.post('/register',userMiddlewares.registerValidator,wrapAsync(authController.registerController))
router.post('/register-admin', userMiddlewares.registerValidator, wrapAsync(authController.registerAdminController))
//login with email
router.post('/user', userMiddlewares.loginValidator,wrapAsync(authController.loginController))
//login with google
router.get('/google',wrapAsync (authController.OauthController))

router.post('/token',wrapAsync(authController.refreshTokenController))
router.post('/forgot-password',userMiddlewares.forgotPassword,wrapAsync(authController.forgotPassController))   
//send email to user to change password
router.post('/reset-password',wrapAsync(authController.resetPassController))



router.post('/status/',wrapAsync(authController.addStatusController))
router.get('/status/',wrapAsync(authController.getStatusController))
router.put('/status/',wrapAsync(authController.updateStatusController))
router.delete('/status/:id',wrapAsync(authController.deleteStatusController))


//------------------------role---------------------
router.post('/role',wrapAsync(rolesController.addRoleController))
router.get('/role',wrapAsync(rolesController.getRolesController))
router.put('/role',wrapAsync(rolesController.updateRoleController))


export default router;