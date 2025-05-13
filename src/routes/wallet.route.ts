import { Router } from "express";
import WalletController from "../controllers/wallet.controller";
import catchAsync from "../utils/catchAsync";

export default class WalletRoute {
  router: Router;
  private walletController: WalletController;

  constructor() {
    this.router = Router();
    this.walletController = new WalletController();
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.get("/", catchAsync(this.walletController.fetchAllWallets));
    this.router.get(
      "/my-wallet",
      catchAsync(this.walletController.fetchUsersWallet)
    );
  }
}
