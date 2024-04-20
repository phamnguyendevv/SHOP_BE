
import ProductServices from '../services/productServices.js'





let productsController = {

    // add product
    addProductController: async (req, res) => {
        const result = await ProductServices.addProduct(req.body)
        return res.json({
            message: 'Thêm sản phẩm thành công!',

        })
    },
    //update product 
    updateProductController: async (req, res) => {
        const result = await ProductServices.updateProduct(req.body)
        return res.json({
            message: 'Cập nhật sản phẩm thành công!',

        })

    },

    deleteProductController: async (req, res) => {
        const result = await ProductServices.deleteProduct(req.body)
        return res.json({
            message: 'Xóa sản phẩm thành công!',
        })
    },
    getProductByCategory: async (req, res) => {
        const result = await ProductServices.getProductByCategory(req.body)
        return res.json({
            message: 'Lấy sản phẩm theo danh mục thành công!',
            data: result
        })
    },
    getProductBySlug: async (req, res) => {
        const result = await ProductServices.getProductBySlug(req.body)
        return res.json({
            message: 'Lấy sản phẩm thành công!',
            result
        })
    },






    // --------------------------------------------product Popular--------------------------------------------
    updateProductPopularController: async (req, res) => {
        const result = await ProductServices.updateProductPopular(req.body)
        return res.json({
            message: 'Cập nhật sản phẩm thành công!',
            result
        })
    },
    getProductPopularByCategory: async (req, res) => {
        const result = await ProductServices.getProductPopularByCategory(req.body)
        return res.json({
            message: 'Lấy sản phẩm phổ biến theo danh mục thành công!',
            result
        })

    },


}


export default productsController;