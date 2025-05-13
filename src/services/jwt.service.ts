import jwt from "jsonwebtoken";
import config from "../config/config";

export default class JWTService {
  private _secret = config.jwt.secret;

  accessToken(data: { userId: string }) {
    const token = jwt.sign(data, this._secret, {
      expiresIn: `${+config.jwt.expireInMinute}m`,
    });
    return token;
  }

  verifyToken(token: string) {
    const decoded = jwt.verify(token, this._secret);
    return decoded;
  }
}
