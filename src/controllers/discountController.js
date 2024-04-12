import discountServices from '../services/discountServices.js';

let discountController = {
    // add discount
    addDiscountController: async (req, res) => {
        const result = await discountServices.addDiscount(req.body)
        return res.json({
            message: 'Thêm mã giảm giá thành công!',
        })
    },
    //update discount 
    updateDiscountController: async (req, res) => {
        const result = await discountServices.updateDiscount(req.body)
        return res.json({
            message: 'Cập nhật mã giảm giá thành công!',
        })

    },

    deleteDiscountController: async (req, res) => {
        const result = await discountServices.deleteDiscount(req.body)
        return res.json({
            message: 'Xóa mã giảm giá thành công!',
        })
    },
    getDiscountByCode: async (req, res) => {
        const result = await discountServices.getDiscountByCode(req.body)
        return res.json({
            message: 'Lấy mã giảm giá theo code thành công!',
            result
        })
    },
    getDiscountById: async (req, res) => {
        const result = await discountServices.getDiscountById(req.body)
        return res.json({
            message: 'Lấy mã giảm giá thành công!',
            result
        })
    },
}
   
export default discountController;