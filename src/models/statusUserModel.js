

let statusUserModel = {
    addStatus: async (connection, status) => {
        await connection.execute(
            `INSERT INTO status_user (name,created_at,
                updated_at) VALUES (?,CURRENT_DATE, 
                    CURRENT_DATE)`,
            [status.name]
        );
    },
    
    getStatus: async (connection, status) => {
        const [rows] = await connection.execute('SELECT * FROM status_user');
        return rows;
    },
    updateStatus: async (connection, status) => {
        await connection.execute(
            `UPDATE status_user SET name = ? WHERE id = ?`,
            [status.name, status.id]
        );
    },
    deleteStatus : async (connection, status) => {
        await connection.execute(
            `DELETE FROM status_user WHERE id = ?`,
            [status.id]
        );
    }


}
export default statusUserModel;