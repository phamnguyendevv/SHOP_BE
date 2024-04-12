let DiscountModel = {
    addDiscount: async (connection, data) => {
        const result = await connection.query('INSERT INTO discount SET ?', data);
        return result;
    },
    updateDiscount: async (connection, data) => {
        const result = await connection.query('UPDATE discount SET ? WHERE id = ?', [data, data.id]);
        if (result[0].affectedRows  === 0) {
           throw new Error("Cập nhật mã giảm giá không thành công")
        }

        return result;
    },
    deleteDiscount: async (connection, data) => {
        const result = await connection.query('DELETE FROM discount WHERE id = ?', data.id);
        return result;
    },
    getDiscountByCode: async (connection, data) => {
        const result = await connection.query('SELECT * FROM discount WHERE discount_code = ? ', data.discount_code);
        if (result[0].length === 0) {
            throw new Error("Không tìm thấy mã giảm giá")
        }
        console.log(result[0])
        return result[0];
    },
    getDiscountById: async (connection, data) => {
        const result = await connection.query('SELECT * FROM discount WHERE id = ?', data.id);
        return result[0];
    }


}


export default DiscountModel;