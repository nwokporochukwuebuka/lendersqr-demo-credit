import { Router } from "express";
import WalletController from "../controllers/wallet.controller";
import catchAsync from "../utils/catchAsync";
import validate from "../middlewares/validate";
import {
  fundWalletValidation,
  transferFundsValidation,
  withdrawFundsValidation,
} from "../validations/wallet.validation";

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
    this.router.post(
      "/fund",
      validate(fundWalletValidation),
      catchAsync(this.walletController.fundWallet)
    );
    this.router.post(
      "/withdraw",
      validate(withdrawFundsValidation),
      catchAsync(this.walletController.withdrawFunds)
    );
    this.router.post(
      "/transfer",
      validate(transferFundsValidation),
      catchAsync(this.walletController.transferFunds)
    );
  }
}
