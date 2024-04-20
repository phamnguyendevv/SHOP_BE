import userServices from '../services/userServices.js'


let userController = {
    getList : async (req, res) => {
        const result = await userServices.getList(req.body)
        return res.json({
            message: 'Get list user successfully!',
            result

        })
    }
}

export default userController;