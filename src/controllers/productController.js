
import ProductServices from '../services/productServices.js'





let productController = {

    // add product
    addProductController: async (req, res) => {
        console.log(req.body);
        const result = await ProductServices.addProduct(req.body)
        return res.json({
            message: 'Thêm sản phẩm thành công!',
            result
        })
    },

}


export default productController;