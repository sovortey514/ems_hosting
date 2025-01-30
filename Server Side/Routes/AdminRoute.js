import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'
import multer from "multer";
import path from "path";
import pool from "../utils/db.js";
const router = express.Router();

router.post("/adminlogin", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ loginStatus: false, Error: "Email and password are required" });
    }

    console.log(`✅ Login request received for email: ${email}`);

    const sql = "SELECT * FROM admin WHERE email = ?";
    
    try {
        const [result] = await con.query(sql, [email]);
        if (result.length === 0) {
            return res.status(401).json({ loginStatus: false, Error: "Invalid email or password" });
        }

        const admin = result[0];

        // ✅ Compare hashed password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ loginStatus: false, Error: "Invalid email or password" });
        }

        // ✅ Generate JWT Token
        const token = jwt.sign({ role: "admin", email: admin.email, id: admin.id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });

        // ✅ Set Secure Cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // Set to `true` in production with HTTPS
            sameSite: "strict",
        });

        return res.status(200).json({ loginStatus: true, message: "Login successful" });

    } catch (error) {
        console.error("❌ Database Query Error:", error);
        return res.status(500).json({ loginStatus: false, Error: "Database query error" });
    }
});


router.get('/category', async (req, res) => {
    try {
        const sql = "SELECT * FROM category";
        const [result] = await pool.query(sql); // Use `await pool.query()` instead of callbacks
        return res.json({ Status: true, Result: result });
    } catch (err) {
        console.error("❌ Query Error:", err);
        return res.status(500).json({ Status: false, Error: err.message });
    }
});


router.post('/add_category', async (req, res) => {
    try {
        const { category } = req.body;

        // Check if category already exists
        const checkQuery = "SELECT * FROM category WHERE name = ?";
        const [existingCategory] = await pool.query(checkQuery, [category]);

        if (existingCategory.length > 0) {
            return res.status(400).json({ Status: false, Error: "Category already exists" });
        }

        // Insert new category
        const insertQuery = "INSERT INTO category (`name`) VALUES (?)";
        await pool.query(insertQuery, [category]);

        return res.json({ Status: true, Message: "Category added successfully" });
    } catch (err) {
        console.error("❌ Query Error:", err);
        return res.status(500).json({ Status: false, Error: err.message });
    }
});

// image upload 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Public/Images')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({
    storage: storage
})


// end imag eupload 

// router.post('/add_employee',upload.single('image'), (req, res) => {
//     const sql = `INSERT INTO employee 
//     (name,email,password, address, salary,image, category_id) 
//     VALUES (?)`;
//     bcrypt.hash(req.body.password, 10, (err, hash) => {
//         if(err) return res.json({Status: false, Error: "Query Error"})
//         const values = [
//             req.body.name,
//             req.body.email,
//             hash,
//             req.body.address,
//             req.body.salary, 
//             req.file.filename,
//             req.body.category_id
//         ]
//         con.query(sql, [values], (err, result) => {
//             if(err) return res.json({Status: false, Error: err})
//             return res.json({Status: true})
//         })
//     })
// })
router.post("/add_employee", upload.single("image"), async (req, res) => {
    try {
        if (!req.body.name || !req.body.email || !req.body.password || !req.body.address || !req.body.salary || !req.body.category_id) {
            return res.json({ Status: false, Error: "Missing required fields" });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const imageFilename = req.file ? req.file.filename : null;

        const sql = `
            INSERT INTO employee (name, email, password, address, salary, profile_image, category_id)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            req.body.name,
            req.body.email,
            hashedPassword,
            req.body.address,
            req.body.salary,
            imageFilename,  // ✅ Correct column name
            req.body.category_id,
        ];

        const [result] = await pool.query(sql, values);
        return res.json({ Status: true, Message: "Employee added successfully" });
    } catch (err) {
        console.error("❌ Error adding employee:", err);
        return res.json({ Status: false, Error: err.message });
    }
});

router.get('/employee', async (req, res) => {
    try {
        const sql = "SELECT id, name, email, address, salary, profile_image FROM employee";
        const [employee] = await pool.query(sql); 

        return res.json({ Status: true, Data: employee }); 
    } catch (err) {
        console.error("❌ Error fetching employees:", err);
        return res.json({ Status: false, Error: err.message });
    }
});
router.get('/employee/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.json({ Status: false, Error: "Invalid Employee ID" });
        }

        const sql = "SELECT id, name, email, address, salary, category_id FROM employee WHERE id = ?";
        const [employee] = await pool.query(sql, [id]); // ✅ Using pool.query() with await

        if (employee.length === 0) {
            return res.json({ Status: false, Error: "Employee not found" });
        }

        return res.json({ Status: true, Result: employee[0] }); // ✅ Return single employee
    } catch (err) {
        console.error("❌ Error fetching employee:", err);
        return res.json({ Status: false, Error: err.message });
    }
});


router.get('/employee/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM employee WHERE id = ?";
    con.query(sql,[id], (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"})
        return res.json({Status: true, Result: result})
    })
})
router.put('/edit_employee/:id', upload.none(), async (req, res) => {
    try {
        const id = req.params.id;
        const { name, email, salary, address, category_id } = req.body;

        // Ensure all required fields are present and not empty
        if (!name || !email || salary == null || !address || category_id == null) {
            return res.json({ Status: false, Error: "Missing required fields" });
        }

        // SQL query to update only text fields (No profile image update)
        const sql = `
            UPDATE employee 
            SET name = ?, email = ?, salary = ?, address = ?, category_id = ? 
            WHERE id = ?
        `;

        const values = [name, email, salary, address, category_id, id];

        const [result] = await pool.query(sql, values);

        return res.json({ Status: true, Message: "Employee updated successfully" });

    } catch (err) {
        console.error("❌ Error updating employee:", err);
        return res.json({ Status: false, Error: err.message });
    }
});

router.delete('/delete_employee/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const sql = "DELETE FROM employee WHERE id = ?";
        
        const [result] = await pool.query(sql, [id]); // ✅ Use `await pool.query()`
        return res.json({ Status: true, Message: "Employee deleted successfully" });
    } catch (err) {
        console.error("❌ Error deleting employee:", err);
        return res.json({ Status: false, Error: err.message });
    }
});


router.get('/admin_count', (req, res) => {
    const sql = "select count(id) as admin from admin";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})

router.get('/employee_count', (req, res) => {
    const sql = "select count(id) as employee from employee";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})

router.get('/salary_count', (req, res) => {
    const sql = "select sum(salary) as salaryOFEmp from employee";
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})

router.get('/admin_records', (req, res) => {
    const sql = "select * from admin"
    con.query(sql, (err, result) => {
        if(err) return res.json({Status: false, Error: "Query Error"+err})
        return res.json({Status: true, Result: result})
    })
})

router.get('/logout', (req, res) => {
    res.clearCookie('token')
    return res.json({Status: true})
})

export { router as adminRouter };
