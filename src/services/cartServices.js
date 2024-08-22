import { DiscountType } from "../constants/typeDiscount.js";
import CartModel from "../models/cartModel.js";
import DiscountModel from "../models/DiscountModel.js";
import UserModel from "../models/userModel.js";

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
    const priceClassify = classify[0].price;
    const balanceUser = user.balance;
    // Tính giá sau khi áp dụng mã giảm giá (nếu có)
    body.price = await calculatePrice(body.code, priceClassify);
    // Kiểm tra số dư
    if (balanceUser < body.price) {
      throw new Error("Số dư không đủ để mua sản phẩm");
    }
    // Tính toán số dư mới và thông tin người giới thiệu
    body.last_balance = balanceUser - body.price;
    const refInfo = await calculateReferralInfo(user, priceClassify);
    Object.assign(body, refInfo);

    // Cập nhật giỏ hàng
    return await CartModel.updateCart(body);
  },
  // removeCart
  removeFromCart: async (data) => {
    try {
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
};
// Hàm phụ trợ để tính giá
async function calculatePrice(code, priceClassify) {
  if (!code) return priceClassify;

  const discount = await DiscountModel.getDiscountByField("code", code);
  if (discount.length === 0) {
    throw new Error("Mã giảm giá không tồn tại");
  }
  return calculateDiscountedPrice(discount, priceClassify);
}
// Hàm phụ trợ để tính giá sau khi áp dụng mã giảm giá  
function calculateDiscountedPrice(discount, priceClassify) {
  const discountInfo = discount[0];
  let lastPrice;

  if (discountInfo.type === DiscountType.PERCENT) {
    const discountAmount = priceClassify * (discountInfo.percent / 100);
    lastPrice = priceClassify - discountAmount;
  } else if (discountInfo.type === DiscountType.AMOUNT) {
    lastPrice = priceClassify - discountInfo.priceClassify;
  } else {
    throw new Error("Loại giảm giá không hợp lệ");
  }

  return Math.max(lastPrice, 0);
}

// Hàm phụ trợ để tính thông tin người giới thiệu
async function calculateReferralInfo(user, price) {
  const ref_user = await UserModel.getUserByField("referral_code", user.referrer_id);
  if (!ref_user) return {};

  const ref_balance = ref_user.balance + 0.2 * price;
  return {
    ref_balance,
    ref_user_id: ref_user.id
  };
}

export default CartService;
