import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Tạo pool kết nối
let connection;
const Connection = async () => {
    if (!connection) {
        try {
            // Tạo pool kết nối
            connection = mysql.createPool({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_DATABASE,
                port: process.env.DB_PORT,
                waitForConnections: true,
                connectionLimit: 10,
                maxIdle: 10,
                idleTimeout: 60000,
                queueLimit: 0
            });

            // In ra thông báo nếu kết nối thành công
            console.log('Connection to database established');
        } catch (error) {
            console.error('Connection to database failed:', error);
            throw error; // Re-throw error to handle it in the calling code
        }
    }
    
    return connection;
}


export default Connection;

