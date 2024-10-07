import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

import { getUserFromCache } from "./cache";
import { verifyToken } from "./jwt";

export const jwtAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bearerToken = req.get("Authorization");

  // Check if bearer token is present in Authorization
  if (!bearerToken || !bearerToken.includes("Bearer")) {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({
        message: "Forbidden",
      })
      .end();
  }

  const [_, token] = bearerToken.split(" ");

  // Verify the given token
  const verificationResult: any = verifyToken(token);

  if (!verificationResult.valid) {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({
        message: "Invalid token",
      })
      .end();
  }

  const userID = verificationResult.decoded.data;

  try {
    // Check if user exists in cache with the given ID
    const userExists = await getUserFromCache(userID);

    if (!userExists) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({
          message: "Token is expired",
        })
        .end();
    }

    // Set userID in request object
    req.userID = userID;

    next(); // Call next middleware or handler
  } catch (error) {
    console.log("Error caught while fetching the user from cache:", error);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({
        message: "Something went wrong",
      })
      .end();
  }
};
