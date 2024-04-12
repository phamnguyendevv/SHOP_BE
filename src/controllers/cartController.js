import CartService from '../services/cartServices.js';

let cartController = {
    addToCartController: async (req, res) => {
        
        const result = await CartService.addToCart(req.body)
        return res.json({
            message: 'Item added to cart',
            result
        })
    },
    removeFromCartController: async (req, res) => {
        const result = await CartService.removeFromCart(req.body)
        return res.json({
            message: 'Item removed from cart',
            result
        })
    },
    updateCartController: async (req, res) => {
        const result = await CartService.updateCart(req.body)
        return res.json({
            message: 'Cart updated',
            result
        })
    },
    getCartController: async (req, res) => {
        const result = await CartService.getCart(req.body)
        return res.json({
            message: 'Cart fetched',
            result
        })
    }
}

export default cartController;