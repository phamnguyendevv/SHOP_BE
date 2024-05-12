import CartModel from '../models/cartModel.js';
import ProductModel from '../models/productModel.js';
import Connection from '../db/configMysql.js';
const connection = await Connection();

let CartService = {
    addToCart: async (data) => {

        const { product_id, user_id, code_discount } = data;
        // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
        const existingCartItem = await CartModel.getCartById(connection, product_id);
        if (!existingCartItem) {
            // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới vào giỏ hàng
            const cart = await CartModel.addCart(connection, data);
            return cart.insertId;
        }
        // Nếu sản phẩm đã có trong giỏ hàng, thì trả về thông báo lỗi đã có sản phẩm trong giỏ hàng
        throw new Error('Sản phẩm đã có trong giỏ hàng');

    },
    // updateCart
    updateCart: async (data) => {
        try {
            const cartUser = await CartModel.updateStatusProduct(connection, data);
            return cartUser;
        } catch (error) {
            throw new Error('Không cập nhật được số lượng sản phẩm trong giỏ hàng');
        }
    },
    // removeCart
    removeFromCart: async (data) => {
        try {
            const cart = await CartModel.removeProductInCart(connection, data);
            return cart;
        } catch (error) {
            throw new Error('Không xóa được sản phẩm trong giỏ hàng');
        }
    },
    // getCart
    getCart: async (data) => {
        const cart = await CartModel.getCartStatus(connection, data);
        if (cart.length === 0) {
            throw new Error('Giỏ hàng trống');
        }
        return cart;

    },
    // getCartSuccess
    getCartSuccess: async (data) => {
        const { page, limit } = data;
        try {
            const cart = await CartModel.getCartSuccess(connection, page, limit);
            return cart;
        } catch (error) {
            throw new Error('Không lấy được giỏ hàng');
        }
    },
    getCartPending: async (data) => {
        const { page, limit } = data;
        try {
            const cart = await CartModel.getCartPending(connection, page, limit);
            return cart;
        } catch (error) {
            throw new Error('Không lấy được giỏ hàng');
        }
    }

}

export default CartService;