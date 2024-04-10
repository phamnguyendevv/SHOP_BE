
import AuthService from '../services/authServices.js'





let authController = {
    registerController: async (req, res) => {
      
        const result = await AuthService.register(req.body)
        return res.json({
            message: 'User created',
        })
    },


    loginController: async (req, res) => {
     
        const result = await AuthService.login(req.body)
        return res.json({
            message: 'login successfull',
            result
        })
    },
    authUserController: async (req, res) => {
       
        const result = await AuthService.auth(req.body)
        return res.json({
            message: 'auth successfull',
            result
        })
    },

    refreshTokenController: async (req, res) => {
        const result = await AuthService.refreshToken(req.body)
        return res.json({
            message: 'refreshToken successfull',
            result
        })
    },
    changePassController: async (req, res) =>{
        const result = await AuthService.changePassword(req.body)
        return res.json({
            message: 'change password successfull'

        })
    },
    confirmPassController: async (req, res) =>{
        const result = await AuthService.confirmPassword(req.body)
        return res.json({
            message: 'confirm password successfull'

        })
    }
    

}


export default authController;