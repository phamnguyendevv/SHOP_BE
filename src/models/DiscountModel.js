let DiscountModel = {
    addDiscount: async (connection, data) => {
        const result = await connection.query('INSERT INTO discount SET ?', data);
        if (result[0].affectedRows  === 0) {
            throw new Error("Thêm mã giảm giá không thành công")
        }
        return result;
    },
    updateDiscount: async (connection, data) => {
        const query = 'UPDATE discount SET user_id = ? ,discount_code = ?, persen_discount = ?, start_discount = ?, end_discount = ?, updated_at = CURDATE() WHERE id = ?';
        const result = await connection.query(query, 
            [data.user_id ,data.discount_code, data.persen_discount, data.start_discount, data.end_discount, data.id]);
        if (result[0].affectedRows  === 0) {
           throw new Error("Cập nhật mã giảm giá không thành công")
        }

        return result;
    },
    deleteDiscount: async (connection, data) => {
        const result = await connection.query('DELETE FROM discount WHERE id = ?', data.id);
        if (result[0].affectedRows  === 0) {
            throw new Error("Xóa mã giảm giá không thành công")
        }
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
    getDiscountById: async (connection, id) => {
        const result = await connection.query('SELECT * FROM discount WHERE id = ?', id);
        if (result[0].length === 0) {
            throw new Error("Không tìm thấy mã giảm giá")
        }
        return result[0];
    }


}


export default DiscountModel;