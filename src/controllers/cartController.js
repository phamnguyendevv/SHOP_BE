import CartService from '../services/cartServices.js';

let cartController = {
    addToCartController: async (req, res) => {
        
        const result = await CartService.addToCart(req.body)
        return res.json({
            message: result,
            status: 200,
        })
    },
    removeFromCartController: async (req, res) => {
       
        const result = await CartService.removeFromCart(req.body)
        return res.json({
            message: 'Xóa sản phẩm khỏi giỏ hàng thành công',
            data: result,
        })
    },
    updateCartController: async (req, res) => {
        const cart = req.cart;
        const product = req.product;
        const classify = req.classify;
        const user = req.user;
        const status = req.status;
        const result = await CartService.updateCart({cart , product, classify, user, status}, req.body)
        return res.json({
            message: 'Câp nhật giỏ hàng thành công',
           
        })
    },
    getCartController: async (req, res) => {
        const result = await CartService.getCart(req.body)
        return res.json({
            message: "Lấy giỏ hàng thành công",
            data: result,
            status: 200,
        })
    }
}

export default cartController;