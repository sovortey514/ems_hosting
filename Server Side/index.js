import express from "express";
import cors from 'cors'
import { adminRouter } from "./Routes/AdminRoute.js";
import { EmployeeRouter } from "./Routes/EmployeeRoute.js";
import Jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();
const PORT = 3000;
const app = express() 
app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ['GET', 'POST', 'PUT', "DELETE"],
    credentials: true,
}))
app.use(express.json())
app.use(cookieParser())
app.use('/auth', adminRouter)
app.use('/employee', EmployeeRouter)
app.use(express.static('Public'))

// const verifyUser = (req, res, next) => {
//     const token = req.cookies.token;
//     if(token) {
//         Jwt.verify(token, "jwt_secret_key", (err ,decoded) => {
//             if(err) return res.json({Status: false, Error: "Wrong Token"})
//             req.id = decoded.id;
//             req.role = decoded.role;
//             next()
//         })
//     } else {
//         return res.json({Status: false, Error: "Not autheticated"})
//     }
// }
// app.get('/verify',verifyUser, (req, res)=> {
//     return res.json({Status: true, role: req.role, id: req.id})
// } )
const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ Status: false, Error: "Not authenticated" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ Status: false, Error: "Invalid Token" });

        req.id = decoded.id;
        req.role = decoded.role;
        next();
    });
};

app.get("/verify", verifyUser, (req, res) => {
    return res.json({ Status: true, role: req.role, id: req.id });
});
app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});