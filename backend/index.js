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
const corsOptions = {
  origin: [
    'https://schoolmanagement-kappa.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization'] // Expose Authorization header
};

// CORS Configuration
app.use(cors(corsOptions))

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
