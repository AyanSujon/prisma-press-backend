import { Request, RequestHandler, Response } from "express";
import HttpStatus from "http-status";
import { userService } from "./user.service";
import { NextFunction } from "express-serve-static-core";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const registerUser = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
        const payload = req.body;
        const user = await userService.registerUserIntoDB(payload);

        sendResponse(res, {
            success: true,
            statusCode: HttpStatus.CREATED,
            message: "user Registered Successfully.",
            data: { user}
        })
})


const getMyProfile = catchAsync(async(req: Request, res: Response, next: NextFunction)=> {
    const profile = await userService.getMyProfileFromDB(req.user?.id as string);

    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK, 
        message: "User profile fetched successfully.",
        data: {profile}
    })


    res.send("get My Profile")
})


const updateMyProfile = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    const userId = req.user?.id as string; 
    const payload = req.body; 

    const updatedProfile = await userService.updateMyProfileInDB(userId, payload);

    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK,
        message: "User profile updated successfully.",
        data: {updatedProfile}
    })
})

export const userController = {
    registerUser,
    getMyProfile,
    updateMyProfile,

}