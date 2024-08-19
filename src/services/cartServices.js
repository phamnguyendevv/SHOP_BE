import CartModel from "../models/cartModel.js";
import ProductModel from "../models/productModel.js";
import UserModel from "../models/userModel.js";
// import Connection from "../db/configMysql.js";
// const connection = await Connection.getConnection();

let CartService = {
  addToCart: async (data) => {
    try {
      // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
      const existingCartItem = await CartModel.getCartByFields(
        "product_id = ? AND user_id = ?",
        [data.product_id, data.user_id]
      );
      if (existingCartItem.length > 0) {
        const updateCart = await CartModel.updateCart(data);
        return "Sản phẩm đã tồn tại trong giỏ hàng";
      }
      const addCart = await CartModel.addCart(data);
      return "Thêm sản phẩm vào giỏ hàng thành công";
      // Kiểm tra xem sản phẩm có tồn tại không
    } catch (error) {
      console.log(error);
      throw new Error("Không thể thêm sản phẩm vào giỏ hàng");
    }
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

    const ref_user = await UserModel.getUserByField(
      "referral_code",
      user.referrer_id
    );

    const ref_balance = ref_user.balance + 0.2 * price_classify;
    console.log(ref_balance);
    const updateRefBalance = await UserModel.updateUser({
      balance: ref_balance,
      id: ref_user.id,
    });

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
    try {
      const cart = await CartModel.getCartStatus(data);

      return cart;
    } catch (error) {
      return { message: "Lỗi khi lấy giỏ hàng", error };
    }
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
