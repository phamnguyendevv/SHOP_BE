
import ProductServices from '../services/productServices.js'





let productController = {

    // add product
    addController: async (req, res) => {
        const result = await ProductServices.addProduct(req.body)
        return res.json({
            message: 'User created',
            result
        })
    },

}


export default productController;