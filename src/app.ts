import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response} from "express";
import config from "./config";
import { prisma } from "./lib/prisma";

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



export default app;


