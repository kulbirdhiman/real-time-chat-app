import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectedDb from "./db/connectDb.js";
import userRoutes from './routes/userRoutes.js'
import chatRoutes from './routes/ChatRoutes.js'
const app = express();

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

connectedDb();

dotenv.config('.env');
const port = process.env.PORT || 4000;

app.use("/api/v1/user" ,userRoutes)
app.use("/api/v1/chat" ,chatRoutes)

app.listen(port, () => console.log(`server up ${port}`));
