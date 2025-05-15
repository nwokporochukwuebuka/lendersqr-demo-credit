import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import httpStatus from "http-status";
import WalletService from "../services/wallet.service";
import { successResponse } from "../utils/response";
import TransactionService from "../services/transaction.service";
import { TransactionStatus, TransactionType } from "../interface";
import { compareHash } from "../utils/hash";
import ApiError from "../utils/ApiError";

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
    const userId = req.user.id;
    const walletService = new WalletService();

    return successResponse(
      res,
      "Wallet fetched successfully",
      await walletService.fetchWalletByUserId(userId)
    );
  }

  async fundWallet(req: Request, res: Response) {
    const userId = req.user.id;
    const { amount } = req.body;

    const walletService = new WalletService();
    const transactionService = new TransactionService();
    // credit the wallet
    const wallet = await walletService.fetchWalletByUserId(userId);

    const creditWallet = await walletService.creditWallet(
      wallet.id,
      parseFloat(amount)
    );

    // save the transaction and return the transaction
    const transaction = await transactionService.saveTransaction({
      id: uuidv4(),
      amount: parseFloat(amount),
      status: TransactionStatus.SUCCESS,
      type: TransactionType.DEPOSIT,
      walletId: wallet.id,
      receiverWalletId: wallet.id,
    });

    return successResponse(res, "Wallet funded successfully", {
      wallet: creditWallet,
      transaction,
    });
  }

  async withdrawFunds(req: Request, res: Response) {
    const { amount, pin } = req.body;

    const { id, tranxPin } = req.user;

    const isPinMatch = compareHash(pin, tranxPin);

    if (!isPinMatch) {
      throw new ApiError(httpStatus.FORBIDDEN, "Invalid pin");
    }

    const walletService = new WalletService();
    const transactionService = new TransactionService();

    const wallet = await walletService.fetchWalletByUserId(id);

    const debitWallet = await walletService.debitWallet(
      wallet.id,
      parseFloat(amount)
    );

    const transaction = await transactionService.saveTransaction({
      id: uuidv4(),
      amount: parseFloat(amount),
      status: TransactionStatus.SUCCESS,
      type: TransactionType.WITHDRAWAL,
      walletId: wallet.id,
    });

    return successResponse(res, "Wallet withdrawal successful", {
      wallet: debitWallet,
      transaction,
    });
  }

  async transferFunds(req: Request, res: Response) {
    const { id, tranxPin } = req.user;

    const { receiverWalletId, amount, pin } = req.body;

    // check pin
    const isPinMatch = compareHash(pin, tranxPin);

    if (!isPinMatch) {
      throw new ApiError(httpStatus.FORBIDDEN, "Invalid pin");
    }

    // debit the customer wallet
    const walletService = new WalletService();
    const transactionService = new TransactionService();
    const senderWallet = await walletService.fetchWalletByUserId(id);
    const receiverWallet = await walletService.fetchWalletById(
      receiverWalletId
    );

    if (senderWallet.id === receiverWallet.id) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "User cannot transfer to self, instead perform a fund operation"
      );
    }

    if (!receiverWallet) {
      throw new ApiError(httpStatus.NOT_FOUND, "User wallet not found");
    }

    // check if he has that funds
    const debitWallet = await walletService.debitWallet(
      senderWallet.id,
      parseFloat(amount)
    );

    // credit the receiver
    await walletService.creditWallet(receiverWallet.id, parseFloat(amount));

    // create the transaction
    const transaction = await transactionService.saveTransaction({
      id: uuidv4(),
      amount: parseFloat(amount),
      status: TransactionStatus.SUCCESS,
      type: TransactionType.TRANSFER,
      walletId: senderWallet.id,
      receiverWalletId: receiverWallet.id,
    });

    return successResponse(res, "wallet transfer successful", {
      walleet: debitWallet,
      transaction,
    });
  }
}
