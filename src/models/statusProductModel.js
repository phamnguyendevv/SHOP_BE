


let statusProductModel = {
    addStatus: async (connection, status) => {
        await connection.execute(
            `INSERT INTO status_product (name,created_at,
                updated_at) VALUES (?,CURRENT_DATE, 
                    CURRENT_DATE)`,
            [status.name]
        );
    },
    
    getStatus: async (connection, status) => {
        const [rows, fields] = await connection.execute('SELECT * FROM status_product');
        return rows;
    },
    updateStatus: async (connection, status) => {
        await connection.execute(
            `UPDATE status_product SET name = ? WHERE id = ?`,
            [status.name, status.id]
        );
    },
    deleteStatus : async (connection, status) => {
        await connection.execute(
            `DELETE FROM status_product WHERE id = ?`,
            [status.id]
        );
    },
    getStatusById: async (connection, id) => {
        const [rows] = await connection.execute('SELECT * FROM status_product WHERE id = ?', [id]);
        return rows[0];
    },


}
export default statusProductModel;