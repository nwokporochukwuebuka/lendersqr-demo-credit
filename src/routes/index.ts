import express, { Router as ExpressRouter } from "express";
import AuthRoute from "./auth.route";

export class Router {
  public routes: ExpressRouter;
  constructor() {
    this.routes = express.Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.routes.use("/auth", new AuthRoute().router);
    // this.routes.use("/users", isAuthenticated, new UserRoutes().router);
    // this.routes.use("/wallets", isAuthenticated, new WalletRoutes().router);
  }
}
