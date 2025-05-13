import db from "../db/knex";
import { IAuthRegister, TableNames } from "../interface";
import { IUser } from "../interface/user";

export default class UserService {
  public async findUserByEmail(email: string): Promise<IUser | undefined> {
    const user = await db(TableNames.USER).where({ email }).first();
    return user;
  }

  public async findUserById(id: string): Promise<IUser> {
    const user = await db(TableNames.USER).where({ id }).first();
    return user;
  }

  public async createUser(payload: IAuthRegister): Promise<IUser> {
    const [id] = await db(TableNames.USER).insert(payload);
    const user = await this.findUserById(id.toString());
    return user;
  }

  public async fetchUserWithWalletByEmail(email: string) {
    const data = await db(TableNames.USER)
      .leftJoin(TableNames.WALLET, "users.id", "wallets.userId")
      .select(
        "users.id as userId",
        "users.firstName",
        "users.lastName",
        "users.email",
        "users.password",
        "users.tranxPin",
        "wallets.id as walletId",
        "wallets.balance"
      )
      .where({ "users.email": email })
      .first();

    return data;
  }

  // sk_live_2mgOGv0upBuVEsAwFGpOYr1IHG2Ps9RK6vXDLLeS

  // https://adjutor.lendsqr.com/v2/verification/karma/:identity
}
