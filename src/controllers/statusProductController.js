import statusProductService from '../services/statusProductServices.js';

let statusProductController = {
    addStatusController: async (req, res) => {
        const result = await statusProductService.addStatus(req.body)
        return res.json({
            message: 'Add new status successfully!',
            result
        })
    },
    getStatusController: async (req, res) => {
        const result = await statusProductService.getStatus(req.body)
        return res.json({
            message: 'Get all status successfully!',
            result
        })
    },
    updateStatusController: async (req, res) => {
        const result = await statusProductService.updateStatus(req.body)
        return res.json({
            message: `Status có id ${req.body.id} đã được cập nhật`
        })
    },
    deleteStatusController: async (req, res) => {

        const {id} =  req.params    
        const result = await statusProductService.deleteStatus(id)
        return res.json({
            message: 'Delete status successfully!',
            result
        })
    }

}

export default statusProductController;