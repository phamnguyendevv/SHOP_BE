import CartService from '../services/cartServices.js';

let cartController = {
    addToCartController: async (req, res) => {
        
        const result = await CartService.addToCart(req.body)
        return res.json({
            message: 'Sản phẩm đã được thêm vào giỏ hàng thành công',
            
        })
    },
    removeFromCartController: async (req, res) => {
       
        const result = await CartService.removeFromCart(req.body)
        return res.json({
            message: 'Xóa sản phẩm khỏi giỏ hàng thành công',
            result
        })
    },
    updateCartController: async (req, res) => {
        const result = await CartService.updateCart(req.body)
        return res.json({
            message: 'Câp nhật giỏ hàng thành công',
           
        })
    },
    getCartController: async (req, res) => {
        const result = await CartService.getCart(req.body)
        return res.json({
            message: 'Lấy giỏ hàng thành công',
            result
        })
    }
}

export default cartController;