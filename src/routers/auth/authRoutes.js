import express from 'express'
import wrapAsync from '../../utils/handlers.js'
import authController from '../../controllers/authController.js'
import userMiddlewares from '../../middlewares/userMiddewares.js'
const router = express.Router()


router.get('/', (req, res) => {
    res.send('Hello World!')
})

router.post('/register',userMiddlewares.registerValidator,wrapAsync(authController.registerController))
router.post('/register-admin', userMiddlewares.registerValidator, wrapAsync(authController.registerAdminController))
//login with email
router.post('/user', userMiddlewares.loginValidator,wrapAsync(authController.loginController))
//login with google
router.get('/google',wrapAsync (authController.OauthController))
router.post('/token',wrapAsync(authController.refreshTokenController))
router.post('/change-password',userMiddlewares.changePassword,wrapAsync(authController.changePassController))

router.post('/forgot-password',userMiddlewares.forgotPassword,wrapAsync(authController.forgotPassController))                





// router.post('/confirm-password',userMiddlewares.changePassword,wrapAsync(authController.confirmPassController))



export default router;