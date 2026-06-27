import dotenv from "dotenv";
import path from "path";

dotenv.config({
    path: path.join(process.cwd(), ".env"),
});

export default {
    port: process.env.PORT || 5000,
    databaseUrl: process.env.DATABASE_URL,
    appUrl: process.env.APP_URL || "http://localhost:5000",
    bcryptSaltRounds: process.env.BCRYPT_SALT_ROUNDS || 10,
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET!,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET!,
    jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN!,
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN!,

}