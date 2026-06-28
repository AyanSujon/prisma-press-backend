import { Request, RequestHandler, Response } from "express";
import HttpStatus from "http-status";
import { userService } from "./user.service";
import { NextFunction } from "express-serve-static-core";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import jwt from "jsonwebtoken";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";




// const registerUser = async (req: Request, res: Response) => {
//     try {
//         const payload = req.body;
//         const user = await userService.registerUserIntoDB(payload);

//         res.status(HttpStatus.CREATED).json({
//             success: true,
//             statusCode: HttpStatus.CREATED,
//             message: "user Registered Successfully.",
//             data: {
//                 user
//             }
//         })

//     } catch (error) {
//         console.log(error);
//         res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
//             success: false,
//             statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
//             message: "failed to register user",
//             error: (error as Error).message
//         })
//     }
// }


const registerUser = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
        const payload = req.body;
        const user = await userService.registerUserIntoDB(payload);

        // res.status(HttpStatus.CREATED).json({
        //     success: true,
        //     statusCode: HttpStatus.CREATED,
        //     message: "user Registered Successfully.",
        //     data: {
        //         user
        //     }
        // })

        sendResponse(res, {
            success: true,
            statusCode: HttpStatus.CREATED,
            message: "user Registered Successfully.",
            data: { user}
        })
})


const getMyProfile = catchAsync(async(req: Request, res: Response, next: NextFunction)=> {
    // const {accessToken} = req.cookies;
    // console.log(req.user, " user request")



    // console.log(accessToken);

    // const verifiedToken = jwtUtils.verifyToken(accessToken, config.jwtAccessSecret);
    // if(typeof verifiedToken === "string"){
    //     throw new Error(verifiedToken)
    // }

    // const profile = await userService.getMyProfileFromDB(verifiedToken.id);
    const profile = await userService.getMyProfileFromDB(req.user?.id as string);

    sendResponse(res, {
        success: true,
        statusCode: HttpStatus.OK, 
        message: "User profile fetched successfully.",
        data: {profile}
    })


    res.send("get My Profile")
})

export const userController = {
    registerUser,
    getMyProfile

}