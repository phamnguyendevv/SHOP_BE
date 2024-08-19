  import mysql from "mysql2/promise";
  import dotenv from "dotenv";

  dotenv.config();

  let pool;

  const Connection = {
    createPool: async () => {
      if (!pool) {
        try {
          pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            port: process.env.DB_PORT,
            waitForConnections: true,
            connectionLimit: 10,
            connectTimeout: 30000,
            maxIdle: 10,
            queueLimit: 0,
            keepAliveInitialDelay: 0,
          });

          // Kiểm tra kết nối
          const connection = await pool.getConnection();
          connection.release();
          console.log("Kết nối đến database thành công");
        } catch (error) {
          console.error("Kết nối thất bại");
          throw error;
        }
      }
      return pool;
    },

    getConnection: async () => {
      const pool = await Connection.createPool();
      return pool.getConnection();
    },

    executeTransaction: async (callback) => {
      const connection = await Connection.getConnection();
      try {
        await connection.beginTransaction();
        const result = await callback(connection);
        await connection.commit();
        return result;
      } catch (error) {
        await connection.rollback();
        console.error("Transaction failed:", error);
        throw error;
      } finally {
        connection.release();
      }
    },

    execute: async (sql, params) => {
      const pool = await Connection.createPool();
      try {
       
        const [results] = await pool.execute(sql, params);
        return results;
      } catch (error) {
        console.error("Prepared statement execution failed:", error);
        throw new Error("Không thể thực thi câu lệnh");
      }
    },
    query: async (sql, params = []) => { // params mặc định là mảng rỗng
      const pool = await Connection.createPool();
      try {
        // Nếu params là mảng rỗng, không cần truyền vào
        const [results] = params.length > 0 ? await pool.query(sql, params) : await pool.query(sql);
        return results;
      } catch (error) {
        console.error("Prepared statement execution failed:", error);
        throw new Error("Không thể thực thi câu lệnh SQL");
      }
    }
  };



  export default Connection;
