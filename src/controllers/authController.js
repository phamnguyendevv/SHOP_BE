
import AuthService from '../services/authServices.js'





let authController = {
    registerController: async (req, res) => {
        const result = await AuthService.register(req.body)
        return res.json({
            message: 'User created',
            result
        })
    },
    loginController: async (req, res) => {
        const user = req.user
        const user_id = user.id.toString()
        const result = await AuthService.login(user_id, req.body)
        return res.json({
            message: 'login successfull',
            result
        })
    }
}


export default authController;