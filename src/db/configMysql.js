import mysql from 'mysql2/promise'
import dotenv from 'dotenv';
dotenv.config();

// Tạo một hàm riêng biệt để kết nối đến cơ sở dữ liệu

    // Establish connection to database
    const connection = mysql.createPool({
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
    // Nếu kết nối thành công, in ra thông báo
    if (connection) {
        console.log('Connection to database established')
    } else {
        console.log('Connection to database failed')
    }
    

// export connection
export default connection;


