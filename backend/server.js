import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import {connectDB} from './lib/db.js';
dotenv.config();
import cookieParser from 'cookie-parser';
import cors from 'cors';
const app = express();

const PORT = process.env.PORT || 5000;
app.use(express.json()); // Parses JSON request body
app.use(express.urlencoded({ extended: true })); // Parses form data
app.use(cookieParser());
app.use (
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
   
    console.log("Server is running on port "+PORT);
    connectDB();
});