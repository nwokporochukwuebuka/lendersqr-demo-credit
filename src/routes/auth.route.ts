import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import validate from "../middlewares/validate";
import {
  loginValidation,
  registerValidation,
} from "../validations/auth.validation";
import catchAsync from "../utils/catchAsync";

export default class AuthRoute {
  public router: Router;
  private authController: AuthController;

  constructor() {
    this.router = Router();
    this.authController = new AuthController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      "/register",
      validate(registerValidation),
      catchAsync(this.authController.register)
    );

    this.router.post(
      "/login",
      validate(loginValidation),
      catchAsync(this.authController.login)
    );
  }
}
