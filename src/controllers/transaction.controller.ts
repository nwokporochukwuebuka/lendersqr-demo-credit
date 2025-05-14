import { Request, Response } from "express";
import TransactionService from "../services/transaction.service";
import WalletService from "../services/wallet.service";
import { successResponse } from "../utils/response";

export default class TransactionController {
  async fetchUserWalletTransaction(req: Request, res: Response) {
    // @ts-ignore
    const { id } = req.user;
    const { page = "1", limit = "10" } = req.query;

    const walletService = new WalletService();

    const wallet = await walletService.fetchWalletByUserId(id);

    const transactionService = new TransactionService();

    const result = await transactionService.getWalletTransaction(wallet.id, {
      page: +page,
      limit: +limit,
    });

    return successResponse(res, "Transactions fetched successfully", result);
  }
}
