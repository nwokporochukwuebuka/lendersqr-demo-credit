import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import ApiError from "../utils/ApiError";
import JWTService from "../services/jwt.service";
import UserService from "../services/user.service";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  tranxPin: string;
  password: string;
}

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized users");
  }

  //   try {
  const jwtService = new JWTService();
  const decoded = jwtService.verifyToken<{ userId: string }>(token);

  const userService = new UserService();

  const user = await userService.findUserById(decoded.userId);
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid credentials");
  }

  req.user = user;

  next();
};
