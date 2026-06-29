import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { ILoginUser } from "./auth.interface"
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";




const loginUser = async (payload: ILoginUser) => {
    const { email, password } = payload;

    // const user = await prisma.user.findUnique({
    //     where: {email}
    // })
    // if(!user){
    //     throw new Error("User not found.")
    // }

    // findUnique alternative function for prisma 

    const user = await prisma.user.findUniqueOrThrow({
        where: { email }
    })

    if (user.activeStatus === "BLOCKED") {
        throw new Error("Your account has been blocked. Please contact support.")
    }


    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
        throw new Error("Password is incorrect.")
    }


    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    }
    // const accessToken = jwt.sign(
    //     jwtPayload, 
    //     config.jwtAccessSecret, 
    //     {
    //         expiresIn: config.jwtAccessExpiresIn
    //     } as SignOptions
    // );

    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwtAccessSecret,
        config.jwtAccessExpiresIn as SignOptions
    )

    // const refreshToken = jwt.sign(
    //     jwtPayload, 
    //     config.jwtRefreshSecret, 
    //     {
    //         expiresIn: config.jwtRefreshExpiresIn
    //     } as SignOptions
    // );

    const refreshToken = jwtUtils.createToken(
        jwtPayload,
        config.jwtRefreshSecret,
        config.jwtRefreshExpiresIn as SignOptions
    )

    return {
        accessToken,
        refreshToken
    };
}


const refreshToken = async (refreshToken: string) => {
    const verifiedRefreshToken = jwtUtils.verifyToken(refreshToken, config.jwtRefreshSecret);

    if(!verifiedRefreshToken.success){
        throw new Error(verifiedRefreshToken.error)
    }

    const {id} = verifiedRefreshToken.data as JwtPayload;

    const user = await prisma.user.findUnique({
        where: {
            id
        }
    })

    if(user?.activeStatus === "BLOCKED"){
        throw new Error("User is blocked!")
    }

    const jwtPayload = {
        id,
        name: user?.name,
        email: user?.email,
        role: user?.role,
    }

    const accessToken = jwtUtils.createToken(jwtPayload, config.jwtAccessSecret, config.jwtAccessExpiresIn as SignOptions)

    return {accessToken};

}


export const authService = {
    loginUser,
    refreshToken,
}