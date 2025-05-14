import { Request, Response } from "express";
import httpStatus from "http-status";
import { v4 as uuidv4 } from "uuid";
import { IAuthLogin, IAuthRegister, TableNames } from "../interface";
import UserService from "../services/user.service";
import { successResponse } from "../utils/response";
import { catchError } from "../utils/catchError";
import { AxiosService } from "../utils/axios";
import { compareHash, generateHash } from "../utils/hash";
import db from "../db/knex";
import JWTService from "../services/jwt.service";
import ApiError from "../utils/ApiError";
import config from "../config/config";

export default class AuthController {
  public async register(req: Request, res: Response) {
    const payload: IAuthRegister = req.body;

    const userService = new UserService();

    const existingUser = await userService.findUserByEmail(
      payload.email.trim().toLowerCase()
    );

    if (existingUser) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Email already exists!");
    }

    const axiosService = new AxiosService();

    const [error, data] = await catchError(
      axiosService.get(
        `${config.adjutor.baseUrl}/verification/karma/${payload.email}`,
        {
          headers: {
            Authorization: `Bearer ${config.adjutor.apiKey}`,
          },
        }
      )
    );

    if (error) {
      throw new ApiError(httpStatus.BAD_REQUEST, error.message);
      // @ts-ignore
    } else if (data?.status !== "success") {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "This user has been blacklisted"
      );
    }
    const hashedPassword = generateHash({
      for: "PASSWORD",
      value: payload.password,
    });

    const hashedPin = generateHash({ for: "PIN", value: payload.pin });

    // generate the user uuid;
    const userId = uuidv4();

    await db.transaction(async (trx) => {
      trx(TableNames.USER).insert({
        id: userId,
        email: payload.email.toLowerCase(),
        password: hashedPassword,
        firstName: payload.firstName,
        lastName: payload.lastName,
        tranxPin: hashedPin,
      });

      await trx(TableNames.WALLET).insert({
        id: uuidv4(),
        userId,
      });
    });

    // fetching customer with the wallet
    const user = await userService.fetchUserWithWalletByEmail(payload.email);

    // generate token
    const jwt = new JWTService();
    const accessToken = jwt.accessToken({ userId: user.userId });

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
      token: { access: accessToken },
    };

    return successResponse(
      res,
      "User registered successfully",
      result,
      httpStatus.CREATED
    );
  }

  public async login(req: Request, res: Response) {
    const payload: IAuthLogin = req.body;
    const userService = new UserService();

    const existingUser = await userService.fetchUserWithWalletByEmail(
      payload.email
    );

    if (!existingUser) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Incorrect email or password");
    }

    // let's compare password
    const isPasswordMatch = compareHash(
      payload.password,
      existingUser.password
    );

    if (!isPasswordMatch) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Incorrect email or password");
    }

    const jwt = new JWTService();
    const accessToken = jwt.accessToken({ userId: existingUser.userId });

    const result = {
      user: {
        id: existingUser.userId,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        email: existingUser.email,
      },
      wallet: {
        id: existingUser.walletId,
        balance: existingUser.balance,
      },
      token: {
        access: accessToken,
      },
    };

    return successResponse(
      res,
      "User logged in successfully",
      result,
      httpStatus.CREATED
    );
  }
}
