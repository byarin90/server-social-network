import { config } from "dotenv"

config()
const authConstant = {
    REFRESH_TOKEN_COOKIE: "refresh_token",
    ACCESS_TOKEN_COOKIE: "access_token",
}


export { authConstant}