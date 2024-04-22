import mysql from 'mysql2/promise';
import fs from 'fs/promises';

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
};

const checkAndCreateDatabase = async () => {
  try {
    const tempConnection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    });

    const [rows] = await tempConnection.query('SHOW DATABASES LIKE ?', [process.env.DB_DATABASE]);
    const databaseExists = rows.length > 0;

    if (!databaseExists) {
      await tempConnection.query(`CREATE DATABASE ${process.env.DB_DATABASE}`);
      console.log(`Database ${process.env.DB_DATABASE} created.`);
    }

    await tempConnection.end();

    return true;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

const tableExists = async (connection, tableName) => {
  const [rows] = await connection.query(
    `SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = ? AND table_name = ?`,
    [connection.config.database, tableName]
  );
  return rows[0].count === 1;
};

const runSQLFile = async (connection, filePath) => {
  const sql = await fs.readFile(filePath, 'utf8');
  const statements = sql.split(';').filter((statement) => statement.trim() !== '');
  for (const statement of statements) {
    try {
      await connection.query(statement);
    } catch (error) {
      continue;
    }
  }
};

const checkExitsDB = async () => {
  try {
    const databaseExists = await checkAndCreateDatabase();
    if (databaseExists) {
      const connection = await mysql.createConnection(config);
      const tableName = 'discount_used';
      const tableExistsResult = await tableExists(connection, tableName);
      if (!tableExistsResult) {
        console.log(`Table ${tableName} does not exist. Running SQL file...`);
        await runSQLFile(connection, './src/db/shopeweb-database.sql');
        console.log('SQL file executed successfully.');
      } 
      console.log('Database is ready to use.');
      await connection.end(); // Đóng kết nối ở đúng chỗ này
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

export default checkExitsDB;
