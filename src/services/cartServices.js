import CartModel from '../models/cartModel.js';
import connection from '../db/configMysql.js';
import ProductModel from '../models/productModel.js';

let CartService = {
    addToCart: async (data) => {
        try {
            const { product_id, user_id, code_discount } = data;
            // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
            const existingCartItem = await CartModel.getCartById(connection, product_id);
            if (!existingCartItem) {
                // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới vào giỏ hàng
                const cart = await CartModel.addCart(connection, data);
                return cart;
            }
            // Nếu sản phẩm đã tồn tại trong giỏ hàng, cập nhật số lượng
            const newQuanity = 1 + existingCartItem.quanity;
            // Cập nhật giỏ hàng
            const updatedCart = await CartModel.updateQuanityCart(connection, { product_id, newQuanity });
            return updatedCart;
        } catch (error) {
            console.log(error);
            throw new Error('Không thêm được sản phẩm'); // Re-throw để bắt ở nơi gọi hàm nếu cần thiết
        }
    },
    // updateCart
    updateCart: async (data) => {
        try {
            const { product_id, user_id, quanity } = data;
          
            const cartUser = await CartModel.getCartByProductId(connection, product_id);
            if (!cartUser) {
                throw new Error('Không tìm thấy sản phẩm trong giỏ hàng');
            }
            const newQuanity = quanity + cartUser.quanity;;
            if (newQuanity === 0) {
                const updatedProductStatus = await CartModel.updateStatusProduct(connection, { status_id: 5, product_id });
                const cart = await CartModel.deleteCart(connection, { product_id,user_id });
            }
            const cart = await CartModel.updateQuanityCart(connection, { product_id, newQuanity });
            return cart;
        } catch (error) {
            throw new Error('Không cập nhật được số lượng sản phẩm trong giỏ hàng');
        }
    },
    // removeCart
    removeFromCart: async (data) => {
        try {
            const { product_id, user_id } = data;
       
            const cartUser = await CartModel.getCartByProductId(connection, product_id);
           
            if (!cartUser) {
                throw new Error('Không tìm thấy sản phẩm trong giỏ hàng');
            }
            const updatedProductStatus = await ProductModel.updateStatusProduct(connection, { status_id: 5, product_id });
            const cart = await CartModel.deleteCart(connection, { product_id ,user_id});
            return cart;
        } catch (error) {
            throw new Error('Không xóa được sản phẩm trong giỏ hàng');
        }
    },
    // getCart
    getCart: async (data) => {
        const { page, limit } = data;
        try {

            const cart = await CartModel.getCart(connection, page, limit);
            return cart;
        } catch (error) {
            throw new Error('Không lấy được giỏ hàng');
        }
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