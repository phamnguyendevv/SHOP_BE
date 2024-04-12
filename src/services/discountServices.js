import connection from '../db/configMysql.js';
import DiscountModel from '../models/DiscountModel.js';


let discountServices = {
    addDiscount: async (data) => {
        data.created_at = data.updated_at = new Date();
        const result = await DiscountModel.addDiscount(connection, data);
        return result;
    },
    updateDiscount: async (data) => {
        data.updated_at = new Date();
        const result = await DiscountModel.updateDiscount(connection, data);
        return result;
    },
    deleteDiscount: async (data) => {
        const result = await DiscountModel.deleteDiscount(connection, data);
        return result;
    },
    getDiscountByCode: async (data) => {
        const result = await DiscountModel.getDiscountByCode(connection, data);
       
        return result;
    },
    getDiscountById: async (data) => {
        const result = await DiscountModel.getDiscountById(connection, data);
        return result;
    },
}

export default discountServices;