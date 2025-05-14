import httpStatus from "http-status";
import db from "../db/knex";
import { TableNames } from "../interface";
import ApiError from "../utils/ApiError";

export default class WalletService {
  // fetch all wallets
  async fetchAllWallets() {
    const wallets = await db(TableNames.WALLET)
      .join(TableNames.USER, { "users.id": "wallets.userId" })
      .select(
        "wallets.id",
        { userId: "users.id" },
        "users.firstName",
        "users.lastName",
        "users.email"
      );
    return wallets;
  }

  async fetchWalletByUserId(userId: string) {
    const wallet = await db(TableNames.WALLET)
      .join(TableNames.USER, "wallets.userId", "users.id")
      .select(
        "wallets.id as id",
        "wallets.userId as userId",
        "wallets.balance as balance"
      )
      .where("wallets.userId", userId) // From token
      .first();
    return wallet;
  }

  async fetchWalletById(id: string) {
    return await db(TableNames.WALLET).where({ id }).first();
  }

  async creditWallet(walletId: string, amount: number) {
    return await db.transaction(async (trx) => {
      const wallet = await trx(TableNames.WALLET)
        .where({ id: walletId })
        .first();

      if (!wallet) {
        throw new ApiError(httpStatus.NOT_FOUND, "Wallet not found");
      }

      // credit  action
      await trx(TableNames.WALLET)
        .where({ id: walletId })
        .update({ balance: parseFloat(wallet.balance) + amount });
      return trx(TableNames.WALLET).where({ id: wallet.id }).first();
    });
  }

  async debitWallet(walletId: string, amount: number) {
    return await db.transaction(async (trx) => {
      const wallet = await trx(TableNames.WALLET)
        .where({ id: walletId })
        .first();

      if (!wallet) {
        throw new ApiError(httpStatus.NOT_FOUND, "Wallet not found");
      }

      if (parseFloat(wallet.balance) < amount) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Insuffient funds");
      }

      // debit action
      await trx(TableNames.WALLET)
        .where({ id: walletId })
        .update({ balance: parseFloat(wallet.balance) - amount });

      return trx(TableNames.WALLET).where({ id: wallet.id }).first();
    });
  }
}
