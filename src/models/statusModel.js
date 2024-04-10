

let statusModel = {
    addStatus: async (connection, status) => {
        await connection.execute(
            `INSERT INTO status (ban, is_verify,created_at,
                updated_at) VALUES (?, ?,CURRENT_DATE, 
                    CURRENT_DATE)`,
            [status.ban, status.is_verify]
        );
    },
    
    getStatus: async (connection, status) => {
        const [rows] = await connection.execute('SELECT * FROM status');
        return rows;
    },
    updateStatus: async (connection, status) => {
        await connection.execute(
            `UPDATE status SET ban = ?, is_verify = ? WHERE id = ?`,
            [status.ban, status.is_verify, status.id]
        );
    },
    deleteStatus : async (connection, status) => {
        await connection.execute(
            `DELETE FROM status WHERE id = ?`,
            [status.id]
        );
    }


}
export default statusModel;