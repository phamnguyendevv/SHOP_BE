
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
        const {id} = req.params
       
        const result = await ProductServices.deleteProduct(id)
        return res.json({
            result
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
        const {slug_product} = req.params
        const result = await ProductServices.getProductBySlug(slug_product)
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

    getList: async (req, res) => {
        const result = await ProductServices.getList(req.body)
        return res.json({
            message: 'Lấy danh sách sản phẩm thành công!',
            result
        })
    },


}


export default productsController;