import CartModel from "../models/cartModel.js";
import ProductModel from "../models/productModel.js";
// import Connection from "../db/configMysql.js";
// const connection = await Connection.getConnection();

let CartService = {
  addToCart: async (data) => {
    // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
    const existingCartItem = await CartModel.getCartByField(
      "product_id",
      data.product_id
    );
    if (existingCartItem.length > 0) {
      throw new Error("Sản phẩm đã tồn tại trong giỏ hàng");
    }
    const addCart = await CartModel.addCart(data);

    // Kiểm tra xem sản phẩm có tồn tại không
  },
  // updateCart
  updateCart: async (data, body) => {
    const { cart, product, user, status, classify } = data;
    const price_classify = classify[0].price;
    const balance_user = user.balance;
    console.log(balance_user, price_classify);
    if (balance_user < price_classify) {
      throw new Error("Số dư không đủ để mua sản phẩm");
      }
      
      const last_balance = balance_user - price_classify;
      body.last_balance = last_balance;

    const updateCart = await CartModel.updateCart(body);

    // const cartUser = await CartModel.updateStatusProduct(data);
    // return cartUser;
  },
  // removeCart
  removeFromCart: async (data) => {
    try {
      console.log(data);
      const cart = await CartModel.removeProductInCart(data);
      return cart;
    } catch (error) {
      throw new Error("Không xóa được sản phẩm trong giỏ hàng");
    }
  },
  // getCart
  getCart: async (data) => {
    console.log(data);
    const cart = await CartModel.getCartStatus(data);
    if (cart.length === 0) {
      throw new Error("Giỏ hàng trống");
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
      throw new Error("Không lấy được giỏ hàng");
    }
  },
  getCartPending: async (data) => {
    const { page, limit } = data;
    try {
      const cart = await CartModel.getCartPending(connection, page, limit);
      return cart;
    } catch (error) {
      throw new Error("Không lấy được giỏ hàng");
    }
  },
};

export default CartService;
