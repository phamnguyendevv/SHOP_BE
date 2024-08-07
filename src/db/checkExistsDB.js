import mysql from "mysql2/promise";
import fs from "fs/promises";
import Connection from "./configMysql.js";

async function createDatabaseIfNotExists() {
  const tempConnection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

  try {
    const [rows] = await tempConnection.query("SHOW DATABASES LIKE ?", [
      process.env.DB_DATABASE,
    ]);
    if (rows.length === 0) {
      await tempConnection.query(`CREATE DATABASE ${process.env.DB_DATABASE}`);
      console.log(`Database ${process.env.DB_DATABASE} created.`);
    }
  } finally {
    await tempConnection.end();
  }
}

async function tableExists(connection, tableName) {
  const [rows] = await connection.query(
    "SELECT 1 FROM information_schema.tables WHERE table_schema = ? AND table_name = ? LIMIT 1",
    [process.env.DB_DATABASE, tableName]
  );
  return rows.length > 0;
}

async function runSQLFile(connection, filePath) {
  const sql = await fs.readFile(filePath, "utf8");
  const statements = sql.split(";").filter((statement) => statement.trim());
  for (const statement of statements) {
    try {
      await connection.query(statement);
    } catch (error) {
      console.warn(`Warning: Failed to execute statement: ${statement}`, error);
    }
  }
}

async function initDatabase() {
  try {
    await createDatabaseIfNotExists();
    console.log(`Database ${process.env.DB_DATABASE} exists.`);

    const connection = await Connection.getConnection();
    try {
      const tableName = "discount_user";
      if (!(await tableExists(connection, tableName))) {
        console.log(`Table ${tableName} does not exist. Running SQL file...`);
        await runSQLFile(connection, "./src/db/shopeweb-database.sql");
        console.log("SQL file executed successfully.");
      }
      console.log(`Database ${process.env.DB_DATABASE} is ready to use.`);
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error while initializing database:", error);
  }
}

export default initDatabase;
