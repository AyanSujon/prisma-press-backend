import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response} from "express";
import config from "./config";
import { prisma } from "./lib/prisma";
import HttpStatus from "http-status";
import bcrypt from "bcryptjs";


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
app.post("/api/users/register", async(req: Request, res: Response)=>{
    
    const {name, email, password, profilePhoto} = req.body;
    const isUserExist = await prisma.user.findUnique({
        where: {email}
    })
    if(isUserExist){
        throw new Error("User with this email already exists.")
    }

    const hashedPassword = await bcrypt.hash(password, Number(config.bcryptSaltRounds));

    const createdUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            
        }
    })

    await prisma.profile.create({
        data: {
            userId: createdUser.id,
            profilePhoto,
            
        }
    })

    const user = await prisma.user.findUnique({
        where: {
            id: createdUser.id,
            email: createdUser.email || email,
        },
        omit:{
            password: true
        },
        include: {
            profile: true
        }
    })


    res.status(HttpStatus.CREATED).json({
        success: true,
        statusCode: HttpStatus.CREATED,
        message: "user Registered Successfully.",
        data: {
            user
        }
        
    
    
    })
})















export default app;


