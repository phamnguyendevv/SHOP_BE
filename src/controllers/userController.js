import userServices from '../services/userServices.js'


let userController = {
    getList : async (req, res) => {
        const result = await userServices.getList(req.body)
        return res.json({
            message: 'Get list user successfully!',
            result

        })
    },
    getUserById : async (req, res) => {
        const {id } = req.query
        const result = await userServices.getUserById(id)
        return res.json({
            message: 'Get user by id successfully!',
            result

        })
    },
    updateUser : async (req, res) => {
        const result = await userServices.updateUser(req.body)
        return res.json({
            message: 'Update user successfully!',
        })
    },
    deleteUser : async (req, res) => {
        const {id } = req.query
        const result = await userServices.deleteUser(id)
        return res.json({
            message: 'Delete user successfully!',
        })
    }

}

export default userController;