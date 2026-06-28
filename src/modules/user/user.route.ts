import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controller";
import { jwtUtils } from "../../utils/jwt";
import config from "../../config";
import { Role } from "../../../generated/prisma/enums";
import HttpStatus from "http-status";

const router = Router();


declare global {
    namespace Express {
        interface Request {
            user?: {
                email: string;
                name: string;
                id: string;
                role: Role; 
            }
        }
    }
}


router.post("/register", userController.registerUser);


router.get("/me", (req: Request, res: Response, next: NextFunction)=>{
 console.log(req.cookies);

   const {accessToken} = req.cookies;
    console.log(accessToken);

    const verifiedToken = jwtUtils.verifyToken(accessToken, config.jwtAccessSecret);
    if(typeof verifiedToken === "string"){
        throw new Error(verifiedToken)
    }
    const {email, name, id, role}= verifiedToken; 

    const requiredRoles = [Role.ADMIN, Role.AUTHOR, Role.USER];

    if(!requiredRoles.includes(role)){
        return res.status(HttpStatus.FORBIDDEN).json({
            success: false,
            statusCode: HttpStatus.FORBIDDEN,
            message: "Forbidden. You don't have permission to access this resource.",

        })
    }

    req.user = {
        email,
        name,
        id,
        role

    }


next();

}, userController.getMyProfile)

export const userRoutes = router;
















