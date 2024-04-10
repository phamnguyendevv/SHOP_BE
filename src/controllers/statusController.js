import statusService from '../services/statusService.js'

let statusController = {
    addStatusController: async (req, res) => {
        const result = await statusService.addStatus(req.body)
        return res.json({
            message: 'Add new status successfully!',
            result
        })
    },
    getStatusController: async (req, res) => {
        const result = await statusService.getStatus(req.body)
        return res.json({
            message: 'Get all status successfully!',
            result
        })
    },
    updateStatusController: async (req, res) => {
        const result = await statusService.updateStatus(req.body)
        return res.json({
            message: `Status có id ${req.body.id} đã được cập nhật`
        })
    },
    deleteStatusController: async (req, res) => {
        const result = await statusService.deleteStatus(req.body)
        return res.json({
            message: 'Delete status successfully!',
            result
        })
    }

}

export default statusController;