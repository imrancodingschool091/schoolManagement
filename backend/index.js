import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser'; // Important if you're using cookies
import { connectDb } from './src/config/db.js';
import { GlobalErrorMiddleware } from './src/middleware/err.middleware.js';
import AuthRoutes from "./src/routes/auth.routes.js";
import FeesRoutes from "./src/routes/fees.routes.js";
import LibraryRoutes from "./src/routes/liabrary.routes.js";
import StudentRoutes from "./src/routes/student.routes.js";
import UserRoutes from "./src/routes/user.routes.js";
import UsersRoutes from "./src/routes/users.routes.js";

dotenv.config();


const app = express();

// CORS Configuration
app.use(cors({
  origin: process.env.FRONTEND_URL, // e.g., http://localhost:5173
  credentials: true, // allow cookies
}));

app.use(cookieParser()); // Important if you send cookies
app.use(express.json());


app.get("/",(req,res)=>{
  res.send("api is working..")
})

connectDb()
// API Routes
app.use("/api/auth", AuthRoutes);
app.use("/api/fees", FeesRoutes);
app.use("/api/library", LibraryRoutes);
app.use("/api/student", StudentRoutes);
app.use("/api/user", UserRoutes);
app.use("/api/users", UsersRoutes);

// Global Error Middleware
app.use(GlobalErrorMiddleware);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
