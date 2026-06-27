import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response} from "express";
import config from "./config";
import { prisma } from "./lib/prisma";
import HttpStatus from "http-status";
import bcrypt from "bcryptjs";
import { userRoutes } from "./modules/user/user.route";
import { authRoutes } from "./modules/auth/auth.route";


const app: Application = express();

app.use(cors({
    origin: config.appUrl,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.get("/", async(req: Request, res: Response) => {
    res.send("Hello, World!");
});




// user Resister API 
app.use("/api/users", userRoutes)


// Login API
app.use("/api/auth", authRoutes);




export default app;


