import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  const createEmployeeTable = async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS employee (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        address VARCHAR(255) NOT NULL,  
        salary DECIMAL(10,2) NOT NULL,
        role ENUM('admin', 'employee') NOT NULL DEFAULT 'employee',
        password VARCHAR(255) NOT NULL,
        profile_image VARCHAR(255) DEFAULT NULL,
        category_id INT NOT NULL,  
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;

    try {
        const connection = await pool.getConnection();
        await connection.query(query);
        connection.release();
        console.log("✅ `employee` table created or already exists.");
    } catch (error) {
        console.error("❌ Error creating `employee` table:", error);
    }
};

const connectDB = async () => {
    try {
      const connection = await pool.getConnection();
      console.log("✅ Connected to MySQL Database");
      connection.release();
    } catch (error) {
      console.error("❌ Database Connection Failed:", error.message);
      process.exit(1); 
    }
  };

  const createAdminTable = async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS admin (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        role ENUM('admin', 'employee') NOT NULL DEFAULT 'admin',
        password VARCHAR(255) NOT NULL,
        profile_image VARCHAR(255) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;

    try {
        const connection = await pool.getConnection();
        await connection.query(query);
        connection.release();
        console.log("✅ `admin` table created or already exists.");
    } catch (error) {
        console.error("❌ Error creating `admin` table:", error);
    }
};

const createCategoryTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS category (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;

  try {
    const connection = await pool.getConnection();
    await connection.query(query);
    connection.release();
    console.log("✅ `category` table created or already exists.");
  } catch (error) {
    console.error("❌ Error creating `category` table:", error);
  }
};


  
connectDB();
createEmployeeTable();
createAdminTable();
createCategoryTable();

export default pool;

