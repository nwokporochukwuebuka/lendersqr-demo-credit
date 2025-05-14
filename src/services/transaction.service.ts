import db from "../db/knex";
import { TableNames, TransactionStatus, TransactionType } from "../interface";

interface ISaveTransactionPayload {
  id: string;
  walletId: string;
  receiverWalletId?: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
}

interface PaginationParams {
  page: number;
  limit: number;
}

export default class TransactionService {
  // fetch all customers transaction

  // save trannsaction
  async saveTransaction(payload: ISaveTransactionPayload) {
    await db(TableNames.TRANSACTION).insert(payload);
    return await this.fetchTransactionById(payload.id);
  }

  async fetchTransactionById(id: string) {
    return await db(TableNames.TRANSACTION).where({ id }).first();
  }

  async getWalletTransaction(
    walletId: string,
    { page = 1, limit = 10 }: PaginationParams
  ) {
    const offset = (page - 1) * limit;

    const [transactions, totalCount] = await Promise.all([
      db(TableNames.TRANSACTION)
        .where("walletId", walletId)
        .orWhere("receiverWalletId", walletId)
        .orderBy("createdAt", "desc")
        .offset(offset)
        .limit(limit),

      // Get total count
      db(TableNames.TRANSACTION)
        .where("walletId", walletId)
        .orWhere("receiverWalletId", walletId)
        .count("* as total")
        .first(),
    ]);

    return {
      data: transactions,
      pagination: {
        total: Number(totalCount?.total) || 0,
        page,
        limit,
        totalPages: Math.ceil(Number(totalCount?.total) / limit),
      },
    };
  }
}
