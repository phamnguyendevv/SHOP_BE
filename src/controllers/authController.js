
import AuthService from '../services/authServices.js'
import statusUserService from '../services/statusUserServices.js'



let authController = {
    registerController: async (req, res) => {
        const result = await AuthService.register(req.body)
        return res.json({
            message: 'Tạo tài khoản thành công',
            status: 200
           
        })
    },

    registerAdminController: async (req, res) => {
        const result = await AuthService.registerAdmin(req.body);
        return res.json({
            message: 'Tạo tài khoản admin thành công',
            status: 200
        })
    },




    loginController: async (req, res) => {
        const user = req.user
       
        const result = await AuthService.login(user);
        return res.json({
          message: "Đăng nhập thành công",
            data: result,
          status: 200
        });
    },

    refreshTokenController: async (req, res) => {
        const result = await AuthService.refreshToken(req.body)
        return res.json({
            message: 'Lấy token thành công',
            data: result,
            status: 200
        })
    },  
    forgotPassController: async (req, res) =>{
        const user = req.user
        const result = await AuthService.forgotPassword(user)
        return res.json({
            message: 'Gửi mã xác nhận thành công',
            status: 200

        })
    },



    resetPassController: async (req, res) =>{
        const result = await AuthService.resetPassword(req.body)
        return res.json({
            message: 'Cập nhật mật khẩu thành công',
            status: 200

        })
    },

    changePasswordController: async (req, res) =>{

        const result = await AuthService.changePassword(req.body)
        return res.json({
            message: 'Cập nhật mật khẩu thành công',
            status: 200
        })
    },

    

    OauthController: async (req, res) =>{
        const code = req.query.code
        const result = await AuthService.Oauth(code)
        return res.json({
            message: 'Đăng nhập thành công với google',
            result,
            status: 200
        })
    },




    verifyCodeController: async (req, res) =>{
        const result = await AuthService.verifyCode(req.body)
        return res.json({
            message: 'Xác thực mã thành công',
            status: 200
        })
    },


    addStatusController: async (req, res) => {
        const result = await statusUserService.addStatus(req.body)
        return res.json({
            message: 'Add new status successfully!',
            data: result,
            status: 200
        })
    },
    getStatusController: async (req, res) => {
        const result = await statusUserService.getStatus(req.body)
        return res.json({
            message: 'Get all status successfully!',
            data: result,
            status: 200
        })
    },
    updateStatusController: async (req, res) => {
        const result = await statusUserService.updateStatus(req.body)
        return res.json({
            message: `Status có id ${req.body.id} đã được cập nhật`,
            status: 200
        })
    },
    deleteStatusController: async (req, res) => {

        const {id} =  req.params
        const result = await statusUserService.deleteStatus(id)
        return res.json({
            message: 'Delete status successfully!',
            status: 200
        })
    }

}


export default authController;