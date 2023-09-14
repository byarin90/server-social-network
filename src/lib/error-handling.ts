
const unauthorizedError = {
    refreshToken : {
        message: "Unauthorized. Refresh token required.",
        errorCode: "MW401",
      },
      accessToken : {
        message: "Unauthorized. Access token required.",
        errorCode: "MW401",
      },
      forbidden :{
        message: "Forbidden. You are not allowed to access this endpoint.",
        errorCode: "MW403",
      },
        internalServerError : {
        message: "Internal Server Error",
        errorCode: "MW500",
        }
}

export {unauthorizedError}