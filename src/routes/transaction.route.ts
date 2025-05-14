import { Router } from "express";
import TransactionController from "../controllers/transaction.controller";
import catchAsync from "../utils/catchAsync";

export default class TransactionRoute {
  router: Router;
  private transactionController: TransactionController;

  constructor() {
    this.router = Router();
    this.transactionController = new TransactionController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      "/",
      catchAsync(this.transactionController.fetchUserWalletTransaction)
    );
  }
}
