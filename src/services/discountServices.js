

import DiscountModel from "../models/DiscountModel.js";

let discountServices = {
  addDiscount: async (data) => {
    data.created_at = data.updated_at = new Date();
    const result = await DiscountModel.addDiscount( data);
    return result;
  },
  updateDiscount: async (data) => {
    data.updated_at = new Date();
    const result = await DiscountModel.updateDiscount(data);
    return result;
  },
  deleteDiscount: async (id) => {
    const result = await DiscountModel.deleteDiscount(id);
    return result;
  },
  getAllDiscounts: async () => {
    const result = await DiscountModel.getAllDiscounts();
    return result;
  },
  getDiscountByCode: async (data) => {
    const result = await DiscountModel.getDiscountByCode(connection, data);

    return result;
  },
  getDiscountById: async (id) => {
    const result = await DiscountModel.getDiscountById(connection, id);
    return result;
  },
};

export default discountServices;
