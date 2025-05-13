import { Router } from "express";
import UserController from "../controllers/user.controller";
import catchAsync from "../utils/catchAsync";

export default class UserRoute {
  public router: Router;
  private userController: UserController;

  constructor() {
    this.router = Router();
    this.userController = new UserController();
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.post("/profile", catchAsync(this.userController.fetchProfile));
  }
}
