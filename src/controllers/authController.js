
import AuthService from '../services/authServices.js'




let authController = {
    registerController: async (req, res) => {
      
        const result = await AuthService.register(req.body)
        return res.json({
            message: 'User created',
        })
    },
    registerAdminController: async (req, res) => {
        const result = await AuthService.register(req.body)
        return res.json({
            message: 'Admin created',
        })
    },




    loginController: async (req, res) => {
        const result = await AuthService.login(req.body)
        return res.json({
            message: 'login successfull',
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

    OauthController: async (req, res) =>{
        const code = req.query.code
        const result = await AuthService.Oauth(code)
        return res.json({
            message: 'Đăng nhập thành công với google',
            result
        })
    },


    forgotPassController: async (req, res) =>{
        const user = req.user
        const result = await AuthService.forgotPassword(user)
        return res.json({
            message: 'forgot password successfull'

        })
    },
}


export default authController;