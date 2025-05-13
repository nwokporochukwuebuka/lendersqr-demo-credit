import express, { Router as ExpressRouter } from "express";
import AuthRoute from "./auth.route";
import UserRoute from "./user.route";
import { auth } from "../middlewares/auth.middleware";
import WalletRoute from "./wallet.route";

export class Router {
  public routes: ExpressRouter;
  constructor() {
    this.routes = express.Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.routes.use("/auth", new AuthRoute().router);
    this.routes.use("/user", auth, new UserRoute().router);
    this.routes.use("/wallets", auth, new WalletRoute().router);
  }
}
