import express from 'express'
import wrapAsync from '../../utils/handlers.js'
import authController from '../../controllers/authController.js'
import userMiddlewares from '../../middlewares/userMiddewares.js'
const router = express.Router()


router.get('/', (req, res) => {
    res.send('Hello World!')
})

router.post('/register', userMiddlewares.registerValidator,wrapAsync(authController.registerController))
router.post('/login', userMiddlewares.loginValidator,wrapAsync(authController.loginController))
router.post('/auth',wrapAsync(authController.authUserController))
router.post('/refresh-token',wrapAsync(authController.refreshTokenController))
router.post('/change-password',userMiddlewares.changePassword,wrapAsync(authController.changePassController))
router.post('/confirm-password',userMiddlewares.changePassword,wrapAsync(authController.confirmPassController))





// router.post('/verify-phone',wrapAsync(authController.verifyPhoneController))
// router.post('/verify-otp',wrapAsync(authController.verifyOtpController))
// router.post('/verify-email',wrapAsync(authController.verifyEmailController))
// router.post('/forgot-password',wrapAsync(authController.forgotPasswordController))
// router.post('/logout',wrapAsync(authController.logoutController))


export default router;