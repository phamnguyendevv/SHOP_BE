import mysql from 'mysql2/promise'
import dotenv from 'dotenv';
dotenv.config();

// Tạo một hàm riêng biệt để kết nối đến cơ sở dữ liệu

// Establish connection to database
const connection = mysql.createPool({
    host: " 20.206.240.27",
    user: "root",
    password: "Leduchai@123Dev",
    database: "shopweb",
    port: "3306",
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


