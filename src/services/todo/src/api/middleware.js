const { StatusCodes } = require("http-status-codes");

const isUserExistsInCache = require("./cache");
const verifyToken = require("./jwt");
const { errorResponse } = require("./response");

const jwtAuth = async (req, res, next) => {
  const bearerToken = req.get("Authorization");

  // Check if bearer token is present in Authorization
  if (!bearerToken || !bearerToken.includes("Bearer")) {
    return errorResponse(res, {
      message: "Forbidden",
      code: StatusCodes.FORBIDDEN,
    });
  }

  const [_, token] = bearerToken.split(" ");

  // Verify the given token
  const verificationResult = verifyToken(token);

  if (!verificationResult.valid) {
    return errorResponse(res, {
      message: "Invalid token",
      code: StatusCodes.FORBIDDEN,
    });
  }

  const userID = verificationResult.decoded.data;

  try {
    // Check if user exists in cache with the given ID
    const userExists = await isUserExistsInCache(userID);

    if (!userExists) {
      return errorResponse(res, {
        message: "Token is expired",
        code: StatusCodes.FORBIDDEN,
      });
    }

    // Set userID in request object
    req.userID = userID;

    next(); // Call next middleware or handler
  } catch (error) {
    console.log("Error caught while fetching the user from cache:", error);

    return errorResponse(res, {
      message: "Something went wrong",
      code: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};

module.exports = jwtAuth;
