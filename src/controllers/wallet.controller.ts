import { Request, Response } from "express";
// import walletService from "../services/wallet.service";
import WalletService from "../services/wallet.service";
import { successResponse } from "../utils/response";

export default class WalletController {
  async fetchAllWallets(req: Request, res: Response) {
    const walletService = new WalletService();
    return successResponse(
      res,
      "Wallets fetched successfully",
      await walletService.fetchAllWallets()
    );
  }

  async fetchUsersWallet(req: Request, res: Response) {
    // @ts-ignore
    const userId = req.user.id;
    const walletService = new WalletService();

    return successResponse(
      res,
      "Wallet fetched successfully",
      await walletService.fetchWalletByUserId(userId)
    );
  }
}
