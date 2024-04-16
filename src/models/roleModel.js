

let RoleModel = {
    addRole: async (connection, name) => {
        try {
            const rows = await connection.execute('INSERT INTO role (name, created_at, updated_at) VALUES (?,CURDATE(), CURDATE())', [name]);
            return rows;
        } catch (error) {
            // Xử lý lỗi ở đây
            throw new Error('Không tìm thấy sản phẩm với id này');
        }
    },

    getRoles: async (connection) => {
        try {
            const [rows] = await connection.execute('SELECT * FROM `role`');
            return rows;
        } catch (error) {
            // Xử lý lỗi ở đây
            throw new Error('Không tìm thấy sản phẩm với id này');
        }
    },

    updateRole: async (connection, roleId, roleName) => {
        try {
            const rows = await connection.execute('UPDATE role SET name = ?, updated_at = CURDATE()  WHERE id = ?', [roleName, roleId]);
            return rows;
        } catch (error) {
            // Xử lý lỗi ở đây
            throw new Error('Không tìm thấy sản phẩm với id này');
        }
    },
   

}
export default RoleModel;