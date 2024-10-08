import userServices from '../services/userServices.js'


let userController = {
    getList : async (req, res) => {
        const result = await userServices.getList(req.body)
        return res.json({
            message: 'Lấy danh sách người dùng thành công!',
            data: result,
            status: 200

        })
    },
    getUserById : async (req, res) => {
        const {id } = req.query
        const result = await userServices.getUserById(id)
        return res.json({
            message: 'Lấy thông tin người dùng thành công!',
            data: result,
            status: 200

        })
    },
    updateUser : async (req, res) => {
        const result = await userServices.updateUser(req.body)
        return res.json({
            message: 'Câp nhật thông tin người dùng thành công!',
            status: 200
        })
    },

}

export default userController;