import Connection from '../db/configMysql.js';


let statusProductModel = {
    addStatus: async ( status) => {
        await Connection.execute(
            `INSERT INTO status_cart (name,created_at,
                updated_at) VALUES (?,CURRENT_DATE, 
                    CURRENT_DATE)`,
            [status.name]
        );
    },
    
    getStatus: async ( status) => {
        const rows = await Connection.execute('SELECT * FROM status_cart');
        return rows;
    },
    updateStatus: async (status) => {
        await Connection.execute(
            `UPDATE status_cart SET name = ? WHERE id = ?`,
            [status.name, status.id]
        );
    },
    deleteStatus : async (status) => {
        await Connection.execute(
            `DELETE FROM status_cart WHERE id = ?`,
            [status.id]
        );
    },
    getStatusById: async (id) => {
        const rows = await Connection.execute('SELECT * FROM status_cart WHERE id = ?', [id]);
        return rows;
    },


}
export default statusProductModel;