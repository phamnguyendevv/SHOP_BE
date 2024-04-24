import statusUserService from '../services/statusUserServices.js'

let statusUserController = {
    addStatusController: async (req, res) => {
        const result = await statusUserService.addStatus(req.body)
        return res.json({
            message: 'Add new status successfully!',
            result
        })
    },
    getStatusController: async (req, res) => {
        const result = await statusUserService.getStatus(req.body)
        return res.json({
            message: 'Get all status successfully!',
            result
        })
    },
    updateStatusController: async (req, res) => {
        const result = await statusUserService.updateStatus(req.body)
        return res.json({
            message: `Status có id ${req.body.id} đã được cập nhật`
        })
    },
    deleteStatusController: async (req, res) => {

        const {id} =  req.params
        const result = await statusUserService.deleteStatus(id)
        return res.json({
            message: 'Delete status successfully!',
            result
        })
    }

}

export default statusUserController;