
import AuthService from '../services/authServices.js'




let authController = {
    registerController: async (req, res) => {
        const result = await AuthService.register(req.body)
        return res.json({
            message: 'Tạo tài khoản thành công',
           
        })
    },

    registerAdminController: async (req, res) => {
        const result = await AuthService.register(req.body)
        return res.json({
            message: 'Tạo tài khoản admin thành công',
        })
    },




    loginController: async (req, res) => {
        const user = req.user
       
        const result = await AuthService.login(user)
        return res.json({
            message: 'Đăng nhập thành công',
            result
        })
    },

    refreshTokenController: async (req, res) => {
        const result = await AuthService.refreshToken(req.body)
        return res.json({
            message: 'Lấy token thành công',
            result
        })
    },  
    forgotPassController: async (req, res) =>{
        const user = req.user
        const result = await AuthService.forgotPassword(user)
        return res.json({
            message: 'Gửi mã xác nhận thành công',
            result

        })
    },



    resetPassController: async (req, res) =>{
        const result = await AuthService.resetPassword(req.body)
        return res.json({
            message: 'Cập nhật mật khẩu thành công'

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




    verifyCodeController: async (req, res) =>{
        const result = await AuthService.verifyCode(req.body)
        return res.json({
            message: 'Xác thực mã thành công',
            result
        })
    }
}


export default authController;