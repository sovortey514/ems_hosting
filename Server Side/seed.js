
import bcrypt from "bcrypt";
import pool from "./utils/db.js";

const seedAdmin = async () => {
  let connection;

  try {
    connection = await pool.getConnection();

    const [employeeRows] = await connection.query(
      "SELECT * FROM employee WHERE email = ?",
      ["admin@gmail.com"]
    );

    const [adminRows] = await connection.query(
      "SELECT * FROM admin WHERE email = ?",
      ["admin@gmail.com"]
    );

    if (employeeRows.length > 0 && adminRows.length > 0) {
      console.log("✅ Admin already exists in both tables. Skipping seeding.");
      return;
    }
    const hashedPassword = await bcrypt.hash("admin", 10);

    if (employeeRows.length === 0) {
      const employeeQuery = `
      INSERT INTO employee (name, email, password, role, address, salary, profile_image, category_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
      await connection.query(employeeQuery, [
        "Admin",
        "admin@gmail.com",
        hashedPassword,
        "admin",
        "Default Address",
        0,
        null,  // ✅ Fix: Adding NULL for profile_image
        1,
      ]);
      console.log("✅ Admin user seeded into employee table.");
  }
    if (adminRows.length === 0) {
      const adminQuery = `
        INSERT INTO admin (name, email, password, role)
        VALUES (?, ?, ?, ?)
      `;
      await connection.query(adminQuery, ["Admin", "admin@gmail.com", hashedPassword, "admin"]);
      console.log("✅ Admin user seeded into admin table.");
    }

  } catch (error) {
    console.error("❌ Error seeding admin user:", error);
  } finally {
    if (connection) connection.release();
  }
};

seedAdmin();
