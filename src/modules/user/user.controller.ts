import { Request, Response } from "express";
import HttpStatus from "http-status";
import { userService } from "./user.service";

const registerUser = async(req: Request, res: Response)=>{
    const payload = req.body;
    const user = await userService.registerUserIntoDB(payload);
    
    res.status(HttpStatus.CREATED).json({
        success: true,
        statusCode: HttpStatus.CREATED,
        message: "user Registered Successfully.",
        data: {
            user
        }
    })
}


export const userController = {
    registerUser,

}