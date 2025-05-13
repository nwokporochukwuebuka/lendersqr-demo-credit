export interface CustomResponse<T = Record<string, any>> {
  status: boolean;
  message: string;
  data?: T;
  statusCode?: number;
}

// Table Types
export const TableNames = {
  USER: "users",
  WALLET: "wallets",
  TRANSACTION: "transactions",
} as const;

// Table Types
export const TransactionType = {
  DEPOSIT: "deposit",
  WITHDRAWAL: "withdrawal",
  TRANSFER: "transfer",
} as const;

// Transaction Status
export const TransactionStatus = {
  PENDING: "pending",
  SUCCESS: "success",
  FAILED: "failed",
};

export interface IAuthRegister {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  pin: string;
}

export interface IAuthLogin {
  email: string;
  password: string;
}
