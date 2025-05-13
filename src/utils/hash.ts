import bcrypt from "bcrypt";
import config from "../config/config";

interface IGenerateHash {
  value: string;
  for: "PIN" | "PASSWORD";
}

export const generateHash = (payload: IGenerateHash) => {
  return bcrypt.hashSync(
    payload.value,
    payload.for === "PASSWORD" ? +config.password.salt : +config.pin.salt
  );
};

export const compareHash = (password: string, hashedPassword: string) => {
  return bcrypt.compareSync(password, hashedPassword);
};
