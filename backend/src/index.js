import express from "express"
import dotenv from "dotenv"
import {connectDB} from "./lib/db.js"
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import cookieParser from "cookie-parser"
import cors from "cors";

dotenv.config();
const PORT=process.env.PORT ;
const app=express();
app.use(express.json());
app.use(cookieParser())  //get values from it while change photo 

app.use(cors({ 
    origin: 'http://localhost:5173',
     credentials: true
}));

 
app.use("/api/auth",authRoutes)
app.use("/api/message",messageRoutes)

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    connectDB()
})