import { Request, Response } from "express";
import UserService from "../services/user.service";
import { successResponse } from "../utils/response";
import httpStatus from "http-status";

export default class UserController {
  public async fetchProfile(req: Request, res: Response) {
    const userId = req.user.id;

    const userService = new UserService();

    const user = await userService.fetchUserWithWalletById(userId);

    const result = {
      user: {
        id: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        createdAt: user.createdAt,
      },
      wallet: {
        id: user.walletId,
        balance: user.balance,
      },
    };

    return successResponse(
      res,
      "User profile fetched successful",
      result,
      httpStatus.OK
    );
  }
}
