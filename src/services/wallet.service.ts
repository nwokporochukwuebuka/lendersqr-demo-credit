import db from "../db/knex";
import { TableNames } from "../interface";

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
  // fetch user's wallet
  //   async fetchSingleWallet(walletId: string) {

  //   }

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
  // fund wallet
  // withdraw funds
  // transfer
}
